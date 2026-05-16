const Student = require('../models/Student');
const Internship = require('../models/Internship');

/**
 * Calculate match percentage between student and internship
 * Pure rule-based matching algorithm (no AI/ML)
 */
const calculateMatch = (student, internship) => {
    // Get student skills (already normalized to lowercase)
    const studentSkills = student.skills || [];

    // Get required skills (already normalized to lowercase)
    const requiredSkills = internship.requiredSkills || [];

    if (requiredSkills.length === 0) {
        return {
            matched: false,
            percentage: 0,
            matchedSkills: [],
            missingSkills: [],
            reason: 'No required skills defined for this internship'
        };
    }

    // Find matched skills
    const matchedSkills = requiredSkills.filter(skill =>
        studentSkills.includes(skill)
    );

    // Find missing skills
    const missingSkills = requiredSkills.filter(skill =>
        !studentSkills.includes(skill)
    );

    // Calculate base match percentage
    let matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;

    // Check CGPA eligibility
    if (internship.eligibility && internship.eligibility.minCGPA) {
        if (student.cgpa < internship.eligibility.minCGPA) {
            return {
                matched: false,
                percentage: 0,
                matchedSkills,
                missingSkills,
                reason: `CGPA requirement not met. Required: ${internship.eligibility.minCGPA}, Your CGPA: ${student.cgpa}`
            };
        }
    }

    // Check year eligibility
    if (internship.eligibility && internship.eligibility.years && internship.eligibility.years.length > 0) {
        if (!internship.eligibility.years.includes(student.year)) {
            return {
                matched: false,
                percentage: 0,
                matchedSkills,
                missingSkills,
                reason: `Year requirement not met. Required years: ${internship.eligibility.years.join(', ')}, Your year: ${student.year}`
            };
        }
    }

    // Check degree eligibility
    if (internship.eligibility && internship.eligibility.degrees && internship.eligibility.degrees.length > 0) {
        const degreeMatches = internship.eligibility.degrees.some(degree =>
            student.degree && student.degree.toLowerCase().includes(degree.toLowerCase())
        );
        if (!degreeMatches) {
            return {
                matched: false,
                percentage: 0,
                matchedSkills,
                missingSkills,
                reason: `Degree requirement not met. Required: ${internship.eligibility.degrees.join(', ')}, Your degree: ${student.degree}`
            };
        }
    }

    // Apply preference bonuses
    if (student.preferences) {
        // Location match bonus (+5%)
        if (student.preferences.locations && student.preferences.locations.length > 0) {
            const locationMatch = student.preferences.locations.some(loc =>
                internship.location && internship.location.toLowerCase().includes(loc.toLowerCase())
            );
            if (locationMatch) {
                matchPercentage += 5;
            }
        }

        // Internship type match bonus (+5%)
        if (student.preferences.internshipType &&
            student.preferences.internshipType === internship.internshipType) {
            matchPercentage += 5;
        }
    }

    // Cap at 100%
    matchPercentage = Math.min(matchPercentage, 100);

    // Determine if internship should be shown (minimum 40% match)
    const matched = matchPercentage >= 40;

    return {
        matched,
        percentage: Math.round(matchPercentage),
        matchedSkills,
        missingSkills,
        isStrongMatch: matchPercentage >= 70
    };
};

/**
 * @desc    Get matched internships for logged-in student
 * @route   GET /api/matching/internships
 * @access  Private (Student)
 */
const getMatchedInternships = async (req, res) => {
    try {
        // Get student profile
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found. Please create your profile first.'
            });
        }

        // Get all active internships
        const internships = await Internship.find({ status: 'active' })
            .populate('companyId', 'companyName location industry logo');

        // Calculate match for each internship
        const matchedInternships = [];

        for (const internship of internships) {
            const matchResult = calculateMatch(student, internship);

            if (matchResult.matched) {
                matchedInternships.push({
                    internship,
                    matchPercentage: matchResult.percentage,
                    matchedSkills: matchResult.matchedSkills,
                    missingSkills: matchResult.missingSkills,
                    isStrongMatch: matchResult.isStrongMatch
                });
            }
        }

        // Sort by match percentage (highest first)
        matchedInternships.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json({
            success: true,
            count: matchedInternships.length,
            matchedInternships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching matched internships',
            error: error.message
        });
    }
};

/**
 * @desc    Get matched students for a specific internship (Company view)
 * @route   GET /api/matching/students/:internshipId
 * @access  Private (Company)
 */
const getMatchedStudents = async (req, res) => {
    try {
        const { internshipId } = req.params;

        // Get internship
        const internship = await Internship.findById(internshipId);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        // Verify ownership (company can only see their own internships)
        const Company = require('../models/Company');
        const company = await Company.findOne({ userId: req.user.id });

        if (!company || internship.companyId.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view students for this internship'
            });
        }

        // Get all students
        const students = await Student.find({});

        // Calculate match for each student
        const matchedStudents = [];

        for (const student of students) {
            const matchResult = calculateMatch(student, internship);

            if (matchResult.matched) {
                matchedStudents.push({
                    student: {
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        college: student.college,
                        degree: student.degree,
                        year: student.year,
                        cgpa: student.cgpa,
                        skills: student.skills
                    },
                    matchPercentage: matchResult.percentage,
                    matchedSkills: matchResult.matchedSkills,
                    missingSkills: matchResult.missingSkills,
                    isStrongMatch: matchResult.isStrongMatch
                });
            }
        }

        // Sort by match percentage (highest first)
        matchedStudents.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json({
            success: true,
            count: matchedStudents.length,
            matchedStudents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching matched students',
            error: error.message
        });
    }
};

/**
 * @desc    Calculate match for a specific student-internship pair
 * @route   GET /api/matching/check/:internshipId
 * @access  Private (Student)
 */
const checkMatch = async (req, res) => {
    try {
        const { internshipId } = req.params;

        // Get student profile
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // Get internship
        const internship = await Internship.findById(internshipId)
            .populate('companyId', 'companyName location industry');

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        // Calculate match
        const matchResult = calculateMatch(student, internship);

        res.status(200).json({
            success: true,
            internship,
            ...matchResult
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking match',
            error: error.message
        });
    }
};

module.exports = {
    calculateMatch,
    getMatchedInternships,
    getMatchedStudents,
    checkMatch
};
