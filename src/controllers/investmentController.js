const Investor = require('../models/Investor');
const Startup = require('../models/Startup');

// @desc    Get investor profile
// @route   GET /api/investments/investor/:investorId
// @access  Private
const getInvestorProfile = async (req, res) => {
    try {
        const investor = await Investor.findById(req.params.investorId).populate('portfolio.startupId', 'startupName domain');

        if (!investor) {
            return res.status(404).json({ error: 'Investor not found' });
        }

        res.json(investor);
    } catch (error) {
        console.error('Get investor profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Make an investment in a startup
// @route   POST /api/investments/invest
// @access  Private
const makeInvestment = async (req, res) => {
    try {
        const { investorId, startupId, amount, equity, notes } = req.body;

        // Validate input
        if (!investorId || !startupId || !amount) {
            return res.status(400).json({ error: 'Investor ID, Startup ID, and amount are required' });
        }

        // Find investor and startup
        const investor = await Investor.findById(investorId);
        const startup = await Startup.findById(startupId);

        if (!investor) {
            return res.status(404).json({ error: 'Investor not found' });
        }

        if (!startup) {
            return res.status(404).json({ error: 'Startup not found' });
        }

        // Check if investor can invest this amount
        if (!investor.canInvest(amount)) {
            return res.status(400).json({
                error: `Cannot invest ₹${amount.toLocaleString('en-IN')}. Available balance: ₹${investor.availableBalance.toLocaleString('en-IN')}`
            });
        }

        // Create investment record for investor
        const investmentForInvestor = {
            startupId: startup._id,
            startupName: startup.startupName,
            amount,
            currency: 'INR',
            equity: equity || 0,
            investmentDate: new Date(),
            status: 'completed',
            notes: notes || ''
        };

        // Create investment record for startup
        const investmentForStartup = {
            investorId: investor._id,
            investorName: investor.name,
            amount,
            currency: 'INR',
            equity: equity || 0,
            investmentDate: new Date(),
            notes: notes || ''
        };

        // Add investment to investor portfolio
        await investor.addInvestment(investmentForInvestor);

        // Add investment to startup's received investments
        await startup.addInvestment(investmentForStartup);

        res.status(201).json({
            message: 'Investment successful!',
            investment: {
                investor: investor.name,
                startup: startup.startupName,
                amount,
                equity,
                date: new Date()
            },
            investorBalance: investor.availableBalance,
            startupFunding: startup.totalFunding
        });
    } catch (error) {
        console.error('Make investment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all investments made by an investor
// @route   GET /api/investments/investor/:investorId/portfolio
// @access  Private
const getInvestorPortfolio = async (req, res) => {
    try {
        const investor = await Investor.findById(req.params.investorId)
            .populate('portfolio.startupId', 'startupName domain foundedYear totalFunding');

        if (!investor) {
            return res.status(404).json({ error: 'Investor not found' });
        }

        res.json({
            totalInvested: investor.totalInvested,
            availableBalance: investor.availableBalance,
            portfolioCount: investor.portfolio.length,
            portfolio: investor.portfolio
        });
    } catch (error) {
        console.error('Get investor portfolio error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all investments received by a startup
// @route   GET /api/investments/startup/:startupId/funding
// @access  Private
const getStartupFunding = async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.startupId)
            .populate('receivedInvestments.investorId', 'name email company');

        if (!startup) {
            return res.status(404).json({ error: 'Startup not found' });
        }

        res.json({
            startupName: startup.startupName,
            totalFunding: startup.totalFunding,
            investorsCount: startup.receivedInvestments.length,
            investments: startup.receivedInvestments
        });
    } catch (error) {
        console.error('Get startup funding error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update investor profile
// @route   PUT /api/investments/investor/:investorId
// @access  Private
const updateInvestorProfile = async (req, res) => {
    try {
        const { phone, location, bio, company, designation, linkedinUrl, investmentRange, minInvestment, maxInvestment, preferredDomains } = req.body;

        const investor = await Investor.findById(req.params.investorId);

        if (!investor) {
            return res.status(404).json({ error: 'Investor not found' });
        }

        // Update fields
        if (phone !== undefined) investor.phone = phone;
        if (location !== undefined) investor.location = location;
        if (bio !== undefined) investor.bio = bio;
        if (company !== undefined) investor.company = company;
        if (designation !== undefined) investor.designation = designation;
        if (linkedinUrl !== undefined) investor.linkedinUrl = linkedinUrl;
        if (investmentRange !== undefined) investor.investmentRange = investmentRange;
        if (minInvestment !== undefined) investor.minInvestment = minInvestment;
        if (maxInvestment !== undefined) investor.maxInvestment = maxInvestment;
        if (preferredDomains !== undefined) investor.preferredDomains = preferredDomains;

        await investor.save();

        res.json({
            message: 'Investor profile updated successfully',
            investor
        });
    } catch (error) {
        console.error('Update investor profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getInvestorProfile,
    makeInvestment,
    getInvestorPortfolio,
    getStartupFunding,
    updateInvestorProfile
};
