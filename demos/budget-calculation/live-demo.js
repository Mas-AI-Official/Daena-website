/**
 * Daena Live Budget Calculation Demo Engine
 * Simulates real-time budget analysis and calculation with synchronized voice-over
 */

class DaenaBudgetCalculationDemo {
    constructor() {
        this.isCalculating = false;
        this.currentPhase = 'input';
        this.budgetData = {};
        this.analysisResults = {};
        this.scenarios = [];
        
        this.init();
    }

    init() {
        this.executeBtn = document.getElementById('budgetExecuteBtn');
        this.statusSection = document.getElementById('budgetStatus');
        this.analysisSection = document.getElementById('budgetAnalysis');
        this.recommendationSection = document.getElementById('budgetRecommendations');
        this.summarySection = document.getElementById('budgetSummary');

        this.setupEventListeners();
        this.resetDemo();
    }

    setupEventListeners() {
        this.executeBtn.addEventListener('click', () => {
            if (!this.isCalculating) {
                this.startCalculation();
            } else {
                this.stopCalculation();
            }
        });
    }

    resetDemo() {
        this.isCalculating = false;
        this.currentPhase = 'input';
        this.budgetData = {};
        this.analysisResults = {};
        this.scenarios = [];
        
        this.executeBtn.textContent = '▶️ REAL TIME DEMO';
        this.executeBtn.classList.remove('executing');
        
        this.statusSection.innerHTML = `
            <div class="budget-status-text">Ready for Budget Analysis</div>
            <div class="budget-status-details">Enter financial data below and press "Real Time Demo" to begin</div>
        `;
        
        this.analysisSection.innerHTML = '<div class="budget-analysis-title">💰 Budget Analysis Results Will Appear Here</div>';
        this.recommendationSection.innerHTML = '<div class="budget-analysis-title">📊 Strategic Recommendations Will Appear Here</div>';
        this.summarySection.innerHTML = '<div class="budget-summary-title">📋 Total Budget Summary Will Appear Here</div>';
    }

    async startCalculation() {
        this.isCalculating = true;
        this.executeBtn.textContent = '⏸ STOP REAL TIME DEMO';
        this.executeBtn.classList.add('executing');

        // Phase 1: Collect Budget Data
        await this.collectBudgetData();

        // Phase 2: Process Financial Analysis
        await this.processFinancialAnalysis();

        // Phase 3: Generate Recommendations
        await this.generateRecommendations();

        // Phase 4: Create Summary
        await this.createBudgetSummary();

        this.stopCalculation();
    }

    stopCalculation() {
        this.isCalculating = false;
        this.executeBtn.textContent = '🔄 RESET & START REAL TIME DEMO';
        this.executeBtn.classList.remove('executing');
    }

    async collectBudgetData() {
        this.updateStatus('🔍 Analyzing Input Data', 'Processing financial requirements...');
        
        // Simulate data collection
        this.budgetData = {
            totalRevenue: 500000,
            operatingExpenses: {
                salaries: 150000,
                marketing: 75000,
                development: 100000,
                overhead: 50000
            },
            projectCosts: {
                software: 25000,
                hardware: 15000,
                training: 10000,
                consulting: 20000
            },
            timeline: 12
        };

        // Show data collection progress
        await this.delay(2000);
        
        this.updateStatus('✅ Data Validation Complete', 'All financial inputs verified and validated');
        
        await this.delay(1500);
    }

    async processFinancialAnalysis() {
        this.updateStatus('🧮 Processing Financial Analysis', 'Budget calculations in progress...');
        
        // Create analysis section
        this.analysisSection.innerHTML = `
            <div class="budget-analysis-title">💰 Budget Analysis Results</div>
            
            <div class="budget-category">
                <div class="budget-category-header">
                    <div class="budget-category-name">📊 Operating Expenses</div>
                    <div class="budget-category-amount">$${this.budgetData.operatingExpenses.salaries + this.budgetData.operatingExpenses.marketing + this.budgetData.operatingExpenses.development + this.budgetData.operatingExpenses.overhead}</div>
                </div>
                <div class="budget-breakdown">
                    <div class="budget-breakdown-item">
                        <span>Salaries</span>
                        <span>$${this.budgetData.operatingExpenses.salaries}</span>
                    </div>
                    <div class="budget-breakdown-item">
                        <span>Marketing</span>
                        <span>$${this.budgetData.operatingExpenses.marketing}</span>
                    </div>
                    <div class="budget-breakdown-item">
                        <span>Development</span>
                        <span>$${this.budgetData.operatingExpenses.development}</span>
                    </div>
                    <div class="budget-breakdown-item">
                        <span>Overhead</span>
                        <span>$${this.budgetData.operatingExpenses.overhead}</span>
                    </div>
                </div>
            </div>

            <div class="budget-category">
                <div class="budget-category-header">
                    <div class="budget-category-name">💻 Project Costs</div>
                    <div class="budget-category-amount">$${this.budgetData.projectCosts.software + this.budgetData.projectCosts.hardware + this.budgetData.projectCosts.training + this.budgetData.projectCosts.consulting}</div>
                </div>
                <div class="budget-breakdown">
                    <div class="budget-breakdown-item">
                        <span>Software</span>
                        <span>$${this.budgetData.projectCosts.software}</span>
                    </div>
                    <div class="budget-breakdown-item">
                        <span>Hardware</span>
                        <span>$${this.budgetData.projectCosts.hardware}</span>
                    </div>
                    <div class="budget-breakdown-item">
                        <span>Training</span>
                        <span>$${this.budgetData.projectCosts.training}</span>
                    </div>
                    <div class="budget-breakdown-item">
                        <span>Consulting</span>
                        <span>$${this.budgetData.projectCosts.consulting}</span>
                    </div>
                </div>
            </div>
        `;

        await this.delay(2000);

        this.updateStatus('✅ Budget Analysis Complete', 'Financial breakdown calculated successfully');
        
        await this.delay(1500);
    }

    async generateRecommendations() {
        this.updateStatus('✨ Generating Recommendations', 'Creating strategic budget optimization suggestions...');
        
        // Generate recommendations
        this.recommendationSection.innerHTML = `
            <div class="budget-analysis-title">📊 Strategic Recommendations</div>
            
            <div class="budget-recommendation-sections">
                <div class="budget-recommendation">
                    <div class="budget-recommendation-title">💡 Cost Optimization</div>
                    <div class="budget-recommendation-content">
                        Based on analysis, recommend negotiating software licensing costs and implementing phased development approach to reduce upfront investment by $15,000.
                    </div>
                </div>
                
                <div class="budget-recommendation">
                    <div class="budget-recommendation-title">📈 Revenue Enhancement</div>
                    <div class="budget-recommendation-content">
                        Budget analysis suggests 23% potential revenue increase through enhanced marketing allocation and customer acquisition strategy.
                    </div>
                </div>
            </div>

            <div class="budget-scenarios">
                <div class="budget-scenarios-title">📊 Budget Scenarios</div>
                
                <div class="budget-scenario-item">
                    <div class="budget-scenario-name">Conservative Budget</div>
                    <div class="budget-scenario-amount">$${Math.floor(this.getTotalBudget() * 0.85)}</div>
                </div>
                
                <div class="budget-scenario-item">
                    <div class="budget-scenario-name">Recommended Budget</div>
                    <div class="budget-scenario-amount">$${this.getTotalBudget()}</div>
                </div>
                
                <div class="budget-scenario-item">
                    <div class="budget-scenario-name">Aggressive Budget</div>
                    <div class="budget-scenario-amount">$${Math.floor(this.getTotalBudget() * 1.2)}</div>
                </div>
            </div>
        `;

        await this.delay(2500);

        this.updateStatus('✅ Recommendations Ready', 'Strategic recommendations completed');
        
        await this.delay(1500);
    }

    async createBudgetSummary() {
        this.updateStatus('📋 Creating Budget Summary', 'Consolidating comprehensive budget overview...');
        
        const totalOperating = this.budgetData.operatingExpenses.salaries + this.budgetData.operatingExpenses.marketing + 
                              this.budgetData.operatingExpenses.development + this.budgetData.operatingExpenses.overhead;
        const totalProject = this.budgetData.projectCosts.software + this.budgetData.projectCosts.hardware + 
                            this.budgetData.projectCosts.training + this.budgetData.projectCosts.consulting;
        const totalBudget = totalOperating + totalProject;

        this.summarySection.innerHTML = `
            <div class="budget-summary-title">📋 Total Budget Summary</div>
            
            <div class="budget-summary-grid">
                <div class="budget-summary-item">
                    <div class="budget-summary-label">Total Operating</div>
                    <div class="budget-summary-value">$${totalOperating}</div>
                </div>
                
                <div class="budget-summary-item">
                    <div class="budget-summary-label">Total Project</div>
                    <div class="budget-summary-value">$${totalProject}</div>      
                </div>
                
                <div class="budget-summary-item">
                    <div class="budget-summary-label">Gross Revenue</div>
                    <div class="budget-summary-value">$${this.budgetData.totalRevenue}</div>
                </div>
                
                <div class="budget-summary-item">
                    <div class="budget-summary-label">Net Profit</div>
                    <div class="budget-summary-value">$${this.budgetData.totalRevenue - totalBudget}</div>
                </div>
                
                <div class="budget-summary-item">
                    <div class="budget-summary-label">Timeline</div>
                    <div class="budget-summary-value">${this.budgetData.timeline} months</div>
                </div>
                
                <div class="budget-summary-item">
                    <div class="budget-summary-label">ROI</div>
                    <div class="budget-summary-value">${Math.round(((this.budgetData.totalRevenue - totalBudget) / totalBudget) * 100)}%</div '+');"></div>
                </div>
            </div>
        `;

        await this.delay(2000);

        this.updateStatus('✅ Budget Calculation Complete', 'Comprehensive budget analysis finished successfully');
        
        await this.delay(1500);
    }

    getTotalBudget() {
        const operating = Object.values(this.budgetData.operatingExpenses).reduce((a, b) => a + b, 0);
        const project = Object.values(this.budgetData.projectCosts).reduce((a, b) => a + b, 0);
        return operating + project;
    }

    updateStatus(title, details) {
        this.statusSection.innerHTML = `
            <div class="budget-status-text processing-animation">${title}</div>
            <div class="budget-status-details">${details}</div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        this.resetDemo();
    }
}

// Initialize demo when page loads
function initializeBudgetDemo() {
    window.budgetDemo = new DaenaBudgetCalculationDemo();
}

// Global function to restart demo
function restartBudgetDemo() {
    if (window.budgetDemo) {
        window.budgetDemo.reset();
    }
}
