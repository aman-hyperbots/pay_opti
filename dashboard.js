import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  BarChart3, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Download,
  RefreshCw,
  Folder,
  Upload,
  Eye,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Percent,
  Building2,
  Search,
  Mail
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import "./App.css"

const PayOptiDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('position');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedMode, setSelectedMode] = useState('');
  const [availableModes, setAvailableModes] = useState([]);
  const [error, setError] = useState(null);
  const [lastLoadedPath, setLastLoadedPath] = useState('');
  const [baseAddress, setBaseAddress] = useState('address'); // Base directory
  const [selectedModeObj, setSelectedModeObj] = useState(null); // Full mode object

  // Load available modes and restore last session on component mount
  useEffect(() => {
    loadAvailableModes();
    restoreLastSession();
  }, []);

  // Save data to localStorage whenever dashboardData changes
  useEffect(() => {
    if (dashboardData) {
      localStorage.setItem('payopti_dashboard_data', JSON.stringify(dashboardData));
      localStorage.setItem('payopti_last_path', lastLoadedPath);
      localStorage.setItem('payopti_selected_mode', selectedMode);
      localStorage.setItem('payopti_base_address', baseAddress);
      localStorage.setItem('payopti_selected_mode_obj', selectedModeObj ? JSON.stringify(selectedModeObj) : '');
      console.log('Data saved to localStorage');
    }
  }, [dashboardData, lastLoadedPath, selectedMode, baseAddress, selectedModeObj]);

  const restoreLastSession = () => {
    try {
      const savedData = localStorage.getItem('payopti_dashboard_data');
      const savedPath = localStorage.getItem('payopti_last_path');
      const savedMode = localStorage.getItem('payopti_selected_mode');
      const savedBaseAddress = localStorage.getItem('payopti_base_address');
      const savedModeObj = localStorage.getItem('payopti_selected_mode_obj');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setDashboardData(parsedData);
        setLastLoadedPath(savedPath || '');
        setSelectedMode(savedMode || '');
        setBaseAddress(savedBaseAddress || 'address');
        setSelectedModeObj(savedModeObj ? JSON.parse(savedModeObj) : null);
        console.log('Restored data from localStorage:', Object.keys(parsedData));
        console.log('Last loaded path:', savedPath);
        console.log('Selected mode:', savedMode);
        console.log('Base address:', savedBaseAddress);
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      // Clear corrupted localStorage data
      localStorage.removeItem('payopti_dashboard_data');
      localStorage.removeItem('payopti_last_path');
      localStorage.removeItem('payopti_selected_mode');
      localStorage.removeItem('payopti_base_address');
      localStorage.removeItem('payopti_selected_mode_obj');
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('payopti_dashboard_data');
    localStorage.removeItem('payopti_last_path');
    localStorage.removeItem('payopti_selected_mode');
    localStorage.removeItem('payopti_base_address');
    localStorage.removeItem('payopti_selected_mode_obj');
    setDashboardData(null);
    setLastLoadedPath('');
    setSelectedMode('');
    setBaseAddress('address');
    setSelectedModeObj(null);
    setError(null);
    console.log('LocalStorage cleared');
  };

  const loadAvailableModes = async () => {
    try {
      // Updated mode list with descriptions
      const modes = [
        // Individual Optimization Modes (15)
        { id: 'mode_aggressive_optimization', name: 'Aggressive Optimization', category: 'optimization' },
        { id: 'mode_balanced', name: 'Balanced Optimization', category: 'optimization' },
        { id: 'mode_cash_conservation', name: 'Cash Conservation', category: 'optimization' },
        { id: 'mode_conservative_risk', name: 'Conservative Risk Management', category: 'optimization' },
        { id: 'mode_crisis_management', name: 'Crisis Management', category: 'optimization' },
        { id: 'mode_growth_expansion', name: 'Growth & Expansion', category: 'optimization' },
        { id: 'mode_international_trade', name: 'International Trade', category: 'optimization' },
        { id: 'mode_ipo_preparation', name: 'IPO Preparation', category: 'optimization' },
        { id: 'mode_liquidity_optimization', name: 'Liquidity Optimization', category: 'optimization' },
        { id: 'mode_manufacturing', name: 'Manufacturing Focus', category: 'optimization' },
        { id: 'mode_merger_acquisition', name: 'Merger & Acquisition', category: 'optimization' },
        { id: 'mode_relationship_building', name: 'Relationship Building', category: 'optimization' },
        { id: 'mode_retail_ecommerce', name: 'Retail & E-commerce', category: 'optimization' },
        { id: 'mode_sox_compliance', name: 'SOX Compliance', category: 'optimization' },
        { id: 'mode_technology_startup', name: 'Technology Startup', category: 'optimization' },
        // Analysis Mode (1)
        { id: 'multi_mode_analysis', name: 'Multi-Mode Comparative Analysis', category: 'analysis' }
      ];
      setAvailableModes(modes);
    } catch (error) {
      console.error('Error loading modes:', error);
    }
  };

  const loadDataFromFolder = async () => {
    if (!baseAddress) {
      setError('Please specify a base directory path');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Load data from the base directory (not mode-specific)
      const data = await loadDataFromPath(baseAddress);
      setDashboardData(data);
      setLastLoadedPath(baseAddress);
      setSelectedMode(''); // Clear mode selection
      setSelectedModeObj(null);
      
      console.log('Data loaded from base directory:', baseAddress);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError(`Failed to load data from ${baseAddress}: ${error.message}`);
      setLoading(false);
    }
  };

  const loadDataFromMode = async (modeId) => {
    if (!modeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Find the full mode object
      const modeObj = availableModes.find(m => m.id === modeId);
      if (!modeObj) {
        throw new Error(`Mode ${modeId} not found`);
      }
      
      // Construct the full path: address/<mode_folder>/
      const modePath = `${baseAddress}/${modeId}`;
      
      console.log('Loading mode:', modeObj.name);
      console.log('Resolved path:', modePath);
      
      // Load data from the mode-specific folder
      const data = await loadDataFromPath(modePath);
      setDashboardData(data);
      setSelectedMode(modeId);
      setSelectedModeObj(modeObj);
      setLastLoadedPath(modePath);
      
      console.log('Data loaded from mode:', modeObj.name, 'at path:', modePath);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading mode data:', error);
      setError(`Failed to load mode ${modeId}: ${error.message}`);
      setLoading(false);
    }
  };

  const loadDataFromPath = async (path) => {
    try {
      console.log('Loading data from path:', path);
      
      // Validate path
      if (!path || path.trim() === '') {
        throw new Error('Invalid path provided');
      }
      
      // Ensure path doesn't start with absolute file system path
      if (path.startsWith('/Users/') || path.startsWith('C:\\') || path.startsWith('/home/')) {
        throw new Error('Cannot use absolute file system paths. Use relative paths like "payopti_output"');
      }
      
      // Define the JSON files to load
      const jsonFiles = [
        'executive_summary.json',
        'payment_sequence.json',
        'traditional_comparison.json',
        'vendor_analysis.json',
        'negotiation_strategies.json',
        'performance_analytics.json',
        'cash_flow_projection.json',
        'ai_insights.json',
        'enhanced_comparison_results.json'
      ];

      const loadedData = {};

      // Load each JSON file
      let loadedFilesCount = 0;
      for (const fileName of jsonFiles) {
        try {
          const filePath = `${path}/${fileName}`;
          console.log('Loading file:', filePath);
          
          const response = await fetch(filePath);
          if (!response.ok) {
            console.warn(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            continue;
          }
          
          const data = await response.json();
          const key = fileName.replace('.json', '').replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          loadedData[key] = data;
          loadedFilesCount++;
          console.log(`Successfully loaded ${fileName} with data keys:`, Object.keys(data));
        } catch (error) {
          console.warn(`Error loading ${fileName}:`, error);
        }
      }
      
      console.log(`Total files loaded: ${loadedFilesCount}/${jsonFiles.length}`);
      if (loadedFilesCount === 0) {
        throw new Error('No files could be loaded. Check the path and ensure files exist.');
      }

      // Map snake_case JSON keys to camelCase React state with comprehensive fallbacks
      const mappedData = {};
      
      // Enhanced mapping with detailed logging and proper fallbacks
      console.log('=== STARTING DATA MAPPING ===');
      console.log('Raw loaded data keys:', Object.keys(loadedData));
      
      // 1. EXECUTIVE SUMMARY - Handle actual PayOpti structure
      if (loadedData.executiveSummary || loadedData.executive_summary) {
        const rawData = loadedData.executiveSummary || loadedData.executive_summary;
        console.log('Raw executive summary:', rawData);
        
        const dashboardMetrics = rawData.dashboard_metrics || rawData.dashboardMetrics || {};
        const optimizationSummary = rawData.optimization_summary || rawData.optimizationSummary || {};
        const keyInsights = rawData.key_insights || rawData.keyInsights || [];
        
        mappedData.executiveSummary = {
          dashboardMetrics: {
            totalPayables: dashboardMetrics.total_payables || dashboardMetrics.totalPayables || 0,
            potentialSavings: dashboardMetrics.potential_savings || dashboardMetrics.potentialSavings || 0,
            activeVendors: dashboardMetrics.active_vendors || dashboardMetrics.activeVendors || 0,
            savingsRate: dashboardMetrics.savings_rate || dashboardMetrics.savingsRate || 0,
            highVrsVendors: dashboardMetrics.high_vrs_vendors || dashboardMetrics.highVrsVendors || 0
          },
          optimizationSummary: {
            strategyUsed: optimizationSummary.strategy_used || optimizationSummary.strategyUsed || '',
            paymentsOptimized: optimizationSummary.payments_optimized || optimizationSummary.paymentsOptimized || 0,
            averageVrsScore: optimizationSummary.average_vrs_score || optimizationSummary.averageVrsScore || 0,
            urgentPayments: optimizationSummary.urgent_payments || optimizationSummary.urgentPayments || 0
          },
          keyInsights: keyInsights
        };
        console.log('✅ Executive summary mapped:', mappedData.executiveSummary);
      }

      // 2. PAYMENT SEQUENCE - Already working, but enhance logging
      if (loadedData.paymentSequence || loadedData.payment_sequence) {
        const rawSequence = loadedData.paymentSequence || loadedData.payment_sequence;
        console.log('Raw payment sequence length:', rawSequence.length);
        
        mappedData.paymentSequence = rawSequence.map(payment => ({
          position: payment.position || 0,
          vendorId: payment.vendor_id || payment.vendorId || '',
          vendorName: payment.vendor_name || payment.vendorName || '',
          invoiceId: payment.invoice_id || payment.invoiceId || '',
          amount: payment.amount || 0,
          aiScore: payment.ai_score || payment.aiScore || 0,
          finalScore: payment.final_score || payment.finalScore || 0,
          businessValue: payment.business_value || payment.businessValue || 0,
          vrs: payment.vrs || 0,
          discountRate: payment.discount_rate || payment.discountRate || 0,
          discountCaptured: payment.discount_captured || payment.discountCaptured || 0,
          paymentTiming: payment.payment_timing || payment.paymentTiming || '',
          reasoning: payment.reasoning || '',
          status: payment.status || 'scheduled'
        }));
        console.log('✅ Payment sequence mapped:', mappedData.paymentSequence.length, 'payments');
      }

      // 3. TRADITIONAL COMPARISON - Handle actual structure with base_results wrapper
      if (loadedData.traditionalComparison || loadedData.traditional_comparison) {
        const rawData = loadedData.traditionalComparison || loadedData.traditional_comparison;
        console.log('Raw traditional comparison:', rawData);
        
        const baseResults = rawData.base_results || rawData.baseResults || {};
        const scenarioComparisons = rawData.scenario_comparisons || rawData.scenarioComparisons || {};
        
        // Extract method results with proper fallbacks
        const payopti = baseResults.payopti || {};
        const avalanche = baseResults.avalanche || {};
        const snowball = baseResults.snowball || {};
        
        // Calculate improvement percentages from base results
        const payoptiSavings = payopti.total_savings || payopti.totalSavings || 0;
        const avalancheSavings = avalanche.total_savings || avalanche.totalSavings || 0;
        const snowballSavings = snowball.total_savings || snowball.totalSavings || 0;
        
        const improvementVsAvalanche = avalancheSavings > 0 ? ((payoptiSavings - avalancheSavings) / avalancheSavings) * 100 : 0;
        const improvementVsSnowball = snowballSavings > 0 ? ((payoptiSavings - snowballSavings) / snowballSavings) * 100 : 0;
        
        // Flatten structure for UI compatibility
        mappedData.traditionalComparison = {
          // Direct method access for UI
          payopti: {
            totalSavings: payoptiSavings,
            vrsPreservation: payopti.vrs_preservation || payopti.vrsPreservation || 0,
            businessValue: payopti.business_value || payopti.businessValue || 0,
            method: payopti.method || 'AI-Optimized Multi-Objective'
          },
          avalanche: {
            totalSavings: avalancheSavings,
            vrsPreservation: avalanche.vrs_preservation || avalanche.vrsPreservation || 0,
            businessValue: avalanche.business_value || avalanche.businessValue || 0,
            method: avalanche.method || 'Highest Discount Rate First'
          },
          snowball: {
            totalSavings: snowballSavings,
            vrsPreservation: snowball.vrs_preservation || snowball.vrsPreservation || 0,
            businessValue: snowball.business_value || snowball.businessValue || 0,
            method: snowball.method || 'Smallest Amount First'
          },
          // Improvement metrics
          improvementVsAvalanche: improvementVsAvalanche,
          improvementVsSnowball: improvementVsSnowball,
          // Keep original structure for advanced features
          baseResults: {
            payopti: {
              totalSavings: payoptiSavings,
              vrsPreservation: payopti.vrs_preservation || payopti.vrsPreservation || 0,
              businessValue: payopti.business_value || payopti.businessValue || 0,
              method: payopti.method || 'AI-Optimized Multi-Objective'
            },
            avalanche: {
              totalSavings: avalancheSavings,
              vrsPreservation: avalanche.vrs_preservation || avalanche.vrsPreservation || 0,
              businessValue: avalanche.business_value || avalanche.businessValue || 0,
              method: avalanche.method || 'Highest Discount Rate First'
            },
            snowball: {
              totalSavings: snowballSavings,
              vrsPreservation: snowball.vrs_preservation || snowball.vrsPreservation || 0,
              businessValue: snowball.business_value || snowball.businessValue || 0,
              method: snowball.method || 'Smallest Amount First'
            }
          },
          scenarioComparisons: scenarioComparisons
        };
        console.log('✅ Traditional comparison mapped:', mappedData.traditionalComparison);
        console.log('Improvement vs Avalanche:', improvementVsAvalanche.toFixed(2) + '%');
        console.log('Improvement vs Snowball:', improvementVsSnowball.toFixed(2) + '%');
      }

      // 4. VENDOR ANALYSIS - Handle snake_case structure
      if (loadedData.vendorAnalysis || loadedData.vendor_analysis) {
        const rawData = loadedData.vendorAnalysis || loadedData.vendor_analysis;
        console.log('Raw vendor analysis:', rawData);
        
        const vendorDistribution = rawData.vendor_distribution || rawData.vendorDistribution || {};
        const riskAnalysis = rawData.risk_analysis || rawData.riskAnalysis || {};
        
        mappedData.vendorAnalysis = {
          vendorDistribution: {
            functionalSuppliers: vendorDistribution.functional_suppliers || vendorDistribution.functionalSuppliers || [],
            transactionalVendors: vendorDistribution.transactional_vendors || vendorDistribution.transactionalVendors || [],
            strategicPartners: vendorDistribution.strategic_partners || vendorDistribution.strategicPartners || []
          },
          riskAnalysis: {
            highRiskVendors: riskAnalysis.high_risk_vendors || riskAnalysis.highRiskVendors || [],
            mediumRiskVendors: riskAnalysis.medium_risk_vendors || riskAnalysis.mediumRiskVendors || [],
            lowRiskVendors: riskAnalysis.low_risk_vendors || riskAnalysis.lowRiskVendors || []
          }
        };
        console.log('✅ Vendor analysis mapped:', mappedData.vendorAnalysis);
      }

      // 5. PERFORMANCE ANALYTICS - Handle negative ROI scenarios
      if (loadedData.performanceAnalytics || loadedData.performance_analytics) {
        const rawData = loadedData.performanceAnalytics || loadedData.performance_analytics;
        console.log('Raw performance analytics:', rawData);
        
        const financialMetrics = rawData.financial_metrics || rawData.financialMetrics || {};
        const performanceIndicators = rawData.performance_indicators || rawData.performanceIndicators || {};
        const comparisonResults = rawData.comparison_results || rawData.comparisonResults || {};
        
        mappedData.performanceAnalytics = {
          financialMetrics: {
            totalSavings: financialMetrics.total_savings || financialMetrics.totalSavings || 0,
            savingsRate: financialMetrics.savings_rate || financialMetrics.savingsRate || 0,
            annualProjection: financialMetrics.annual_projection || financialMetrics.annualProjection || 0,
            implementationCost: financialMetrics.implementation_cost || financialMetrics.implementationCost || 0,
            roiPercentage: financialMetrics.roi_percentage || financialMetrics.roiPercentage || 0,
            paybackPeriodMonths: financialMetrics.payback_period_months || financialMetrics.paybackPeriodMonths || 0
          },
          performanceIndicators: {
            optimizationAccuracy: performanceIndicators.optimization_accuracy || performanceIndicators.optimizationAccuracy || 0,
            timeReduction: performanceIndicators.time_reduction || performanceIndicators.timeReduction || 0,
            vendorSatisfaction: performanceIndicators.vendor_satisfaction || performanceIndicators.vendorSatisfaction || 0,
            processEfficiency: performanceIndicators.process_efficiency || performanceIndicators.processEfficiency || 0
          },
          comparisonResults: comparisonResults
        };
        console.log('✅ Performance analytics mapped:', mappedData.performanceAnalytics);
      }

      // 6. CASH FLOW PROJECTION - Handle actual values
      if (loadedData.cashFlowProjection || loadedData.cash_flow_projection) {
        const rawData = loadedData.cashFlowProjection || loadedData.cash_flow_projection;
        console.log('Raw cash flow projection:', rawData);
        
        const cashFlowTimeline = rawData.cash_flow_timeline || rawData.cashFlowTimeline || [];
        
        mappedData.cashFlowProjection = {
          initialCash: rawData.initial_cash || rawData.initialCash || 0,
          minimumReserve: rawData.minimum_reserve || rawData.minimumReserve || 0,
          finalCashBalance: rawData.final_cash_balance || rawData.finalCashBalance || 0,
          totalPayments: rawData.total_payments || rawData.totalPayments || 0,
          totalSavings: rawData.total_savings || rawData.totalSavings || 0,
          cashUtilization: rawData.cash_utilization || rawData.cashUtilization || 0,
          reserveCompliance: rawData.reserve_compliance || rawData.reserveCompliance || false,
          cashFlowTimeline: cashFlowTimeline.map(item => ({
            paymentId: item.payment_id || item.paymentId || '',
            vendor: item.vendor || '',
            amount: item.amount || 0,
            runningBalance: item.running_balance || item.runningBalance || 0,
            reserveCushion: item.reserve_cushion || item.reserveCushion || 0,
            date: item.date || '',
            status: item.status || 'scheduled',
            discountCaptured: item.discount_captured || item.discountCaptured || 0
          }))
        };
        console.log('✅ Cash flow projection mapped:', mappedData.cashFlowProjection);
      }

      // 7. NEGOTIATION STRATEGIES
      if (loadedData.negotiationStrategies || loadedData.negotiation_strategies) {
        const rawData = loadedData.negotiationStrategies || loadedData.negotiation_strategies;
        // Convert all snake_case fields to camelCase and provide fallbacks
        const mappedStrategies = {};
        Object.keys(rawData).forEach(vendorId => {
          const strategy = rawData[vendorId];
          mappedStrategies[vendorId] = {
            approach: strategy.approach || '',
            successProbability: strategy.success_probability ?? strategy.successProbability ?? 0,
            keyLeveragePoints: strategy.key_leverage_points ?? strategy.keyLeveragePoints ?? [],
            draftEmail: strategy.draft_email ?? strategy.draftEmail ?? '',
            negotiationGoals: strategy.negotiation_goals ?? strategy.negotiationGoals ?? [],
            relationshipContext: strategy.relationship_context ?? strategy.relationshipContext ?? {
              yearsOfRelationship: 'N/A',
              totalBusinessVolume: 'N/A',
              relationshipStrength: 'Unknown'
            },
            marketContext: strategy.market_context ?? strategy.marketContext ?? {},
            modeContext: strategy.mode_context ?? strategy.modeContext ?? {}
          };
        });
        mappedData.negotiationStrategies = mappedStrategies;
        // Debug log
        console.log('Negotiation strategies for UI:', mappedData.negotiationStrategies);
      }

      // 8. AI INSIGHTS - New integration
      if (loadedData.aiInsights || loadedData.ai_insights) {
        mappedData.aiInsights = loadedData.aiInsights || loadedData.ai_insights;
        console.log('✅ AI insights mapped:', Object.keys(mappedData.aiInsights).length, 'vendor insights');
      }

      // 9. ENHANCED COMPARISON RESULTS - New integration
      if (loadedData.enhancedComparisonResults || loadedData.enhanced_comparison_results) {
        const rawData = loadedData.enhancedComparisonResults || loadedData.enhanced_comparison_results;
        console.log('Raw enhanced comparison results:', rawData);
        
        mappedData.enhancedComparisonResults = {
          summary: rawData.summary || {},
          detailedResults: rawData.detailed_results || rawData.detailedResults || {}
        };
        console.log('✅ Enhanced comparison results mapped:', mappedData.enhancedComparisonResults);
      }

      console.log('=== MAPPING COMPLETE ===');
      console.log('Final mapped data keys:', Object.keys(mappedData));
      console.log('Payment sequence length:', mappedData.paymentSequence ? mappedData.paymentSequence.length : 'undefined');
      console.log('Executive summary exists:', !!mappedData.executiveSummary);
      console.log('Traditional comparison exists:', !!mappedData.traditionalComparison);
      console.log('Vendor analysis exists:', !!mappedData.vendorAnalysis);
      console.log('Performance analytics exists:', !!mappedData.performanceAnalytics);
      console.log('Cash flow projection exists:', !!mappedData.cashFlowProjection);
      console.log('AI insights exists:', !!mappedData.aiInsights);
      console.log('Enhanced comparison exists:', !!mappedData.enhancedComparisonResults);

      return mappedData;

    } catch (error) {
      console.error('Error loading data from path:', error);
      
      // Fallback to mock data if loading fails
      console.log('Falling back to mock data...');
      return {
        executiveSummary: {
          dashboardMetrics: {
            totalPayables: 559900,
            potentialSavings: 11248.52,
            activeVendors: 5,
            savingsRate: 2.009023039828541,
            highVrsVendors: 0
          },
          optimizationSummary: {
            strategyUsed: "AI-Powered Multi-Objective Optimization",
            paymentsOptimized: 5,
            averageVrsScore: 68.25333333333333,
            urgentPayments: 5
          },
          keyInsights: [
            "Optimized 5 vendor payments",
            "Potential savings of $11,248.52 (2.0%)",
            "Maintained relationships with 0 strategic vendors",
            "Prioritized 2 high-discount opportunities"
          ]
        },
        paymentSequence: [
          {
            position: 1,
            vendorId: "VENDOR_APEX_001",
            vendorName: "Apex Steel Solutions",
            invoiceId: "INV-001",
            amount: 245000,
            aiScore: 0.5706659817351598,
            finalScore: 0.6277325799086758,
            businessValue: 10791.302756164381,
            vrs: 75.73333333333333,
            discountRate: 2.5,
            discountCaptured: 6125.0,
            paymentTiming: "2025-08-01",
            reasoning: "The payment to Apex Steel Solutions was prioritized in position #1 due to its relatively high AI score of 0.571 and a significant Vendor Risk Score (VRS) of 75.7, indicating a critical supplier relationship, along with a 2.5% discount that offers cost savings.",
            status: "scheduled"
          },
          {
            position: 2,
            vendorId: "VENDOR_TECHFLOW_001",
            vendorName: "TechFlow Logistics",
            invoiceId: "INV-002",
            amount: 89500,
            aiScore: 0.544866210045662,
            finalScore: 0.5993528310502283,
            businessValue: 4065.603067945206,
            vrs: 67.46666666666667,
            discountRate: 3.0,
            discountCaptured: 2685.0,
            paymentTiming: "2025-07-27",
            reasoning: "The payment to TechFlow Logistics was prioritized in position #2 due to its relatively high Vendor Risk Score (VRS) of 67.5, indicating a significant risk that necessitates timely payment, and the 3.0% discount offered, which provides a cost-saving opportunity for the company.",
            status: "scheduled"
          },
          {
            position: 3,
            vendorId: "VENDOR_GLOBALTECH_001",
            vendorName: "GlobalTech Components",
            invoiceId: "INV-005",
            amount: 134200,
            aiScore: 0.5545990867579909,
            finalScore: 0.5545990867579909,
            businessValue: 3261.7425816438363,
            vrs: 71.66666666666666,
            discountRate: 1.8,
            discountCaptured: 2415.6000000000004,
            paymentTiming: "2025-08-06",
            reasoning: "The payment to GlobalTech Components was prioritized in position #3 due to its relatively high Vendor Risk Score (VRS) of 71.7, indicating a significant risk if delayed, and the AI Score of 0.555, which suggests moderate urgency. Additionally, the 1.8% discount offers a small financial incentive for timely payment.",
            status: "scheduled"
          },
          {
            position: 4,
            vendorId: "VENDOR_DATASYS_001",
            vendorName: "DataSys IT Services",
            invoiceId: "INV-003",
            amount: 67800,
            aiScore: 0.5006394957423874,
            finalScore: 0.6007673948908648,
            businessValue: 0.0,
            vrs: 63.4,
            discountRate: 0.02,
            discountCaptured: 13.56,
            paymentTiming: "2025-07-24",
            reasoning: "The payment to DataSys IT Services was prioritized at position #4 due to its moderate AI score of 0.501 and a relatively high Vendor Risk Score (VRS) of 63.4, indicating a significant risk that necessitates timely payment despite the minimal discount of 0.02%.",
            status: "scheduled"
          },
          {
            position: 5,
            vendorId: "VENDOR_QUICKSUPPLY_001",
            vendorName: "QuickSupply Office",
            invoiceId: "INV-004",
            amount: 23400,
            aiScore: 0.4625210900204132,
            finalScore: 0.6937816350306198,
            businessValue: 0.0,
            vrs: 63.0,
            discountRate: 0.04,
            discountCaptured: 9.360000000000001,
            paymentTiming: "2025-07-22",
            reasoning: "The payment to QuickSupply Office was prioritized in position #5 due to its moderate AI score of 0.463 and a relatively high Vendor Risk Score (VRS) of 63.0, indicating a significant risk that necessitates timely payment despite the minimal discount of 0.04%.",
            status: "scheduled"
          }
        ],
        traditionalComparison: {
          payopti: { totalSavings: 11248.52, method: "AI-Optimized Multi-Objective" },
          avalanche: { totalSavings: 9800, method: "Highest Discount Rate First" },
          snowball: { totalSavings: 8500, method: "Smallest Amount First" },
          improvementVsAvalanche: 14.8,
          improvementVsSnowball: 32.3
        },
        vendorAnalysis: {
          vendorDistribution: {
            strategicPartners: [],
            functionalSuppliers: [
              { vendorId: "VENDOR_APEX_001", vendorName: "Apex Steel Solutions", vrsScore: 75.73333333333333, annualSpend: 1850000 }
            ],
            transactionalVendors: [
              { vendorId: "VENDOR_TECHFLOW_001", vendorName: "TechFlow Logistics", vrsScore: 67.46666666666667, annualSpend: 650000 },
              { vendorId: "VENDOR_DATASYS_001", vendorName: "DataSys IT Services", vrsScore: 63.4, annualSpend: 420000 },
              { vendorId: "VENDOR_QUICKSUPPLY_001", vendorName: "QuickSupply Office", vrsScore: 63.0, annualSpend: 180000 },
              { vendorId: "VENDOR_GLOBALTECH_001", vendorName: "GlobalTech Components", vrsScore: 71.66666666666666, annualSpend: 950000 }
            ]
          },
          riskAnalysis: {
            highRiskVendors: [
              { vendorId: "VENDOR_TECHFLOW_001", vendorName: "TechFlow Logistics", riskScore: 67.5 },
              { vendorId: "VENDOR_DATASYS_001", vendorName: "DataSys IT Services", riskScore: 63.4 },
              { vendorId: "VENDOR_QUICKSUPPLY_001", vendorName: "QuickSupply Office", riskScore: 63.0 }
            ],
            mediumRiskVendors: [
              { vendorId: "VENDOR_APEX_001", vendorName: "Apex Steel Solutions", riskScore: 75.7 },
              { vendorId: "VENDOR_GLOBALTECH_001", vendorName: "GlobalTech Components", riskScore: 71.7 }
            ],
            lowRiskVendors: []
          }
        },
        negotiationStrategies: {
          "VENDOR_APEX_001": {
            approach: "collaborative",
            successProbability: 0.85,
            relationshipContext: {
              yearsOfRelationship: 3,
              totalBusinessVolume: "$1,850,000",
              invoicesProcessed: 24,
              relationshipStrength: "strong"
            },
            marketContext: {
              marketPosition: "leader",
              competitorLandscape: "5 competitors",
              marketShare: "12.0%",
              priceTrend: "stable"
            },
            keyLeveragePoints: [
              "Strong 3-year partnership with $1,850,000 in total business",
              "Market leader position with 12.0% market share",
              "Consistent payment reliability and strategic partnership value"
            ],
            draftEmail: `Dear Apex Steel Solutions team,

We value our 3-year partnership and the $1,850,000 in business we've conducted together. As a market leader with 12.0% market share, we believe there's significant opportunity to optimize our payment terms for mutual benefit.

Given our strong payment history and strategic relationship, we'd like to discuss extending payment terms to 45-60 days while securing enhanced early payment discounts. This would strengthen our partnership and create additional value for both organizations.

Best regards,
PayOpti Team`,
            negotiationGoals: [
              "Extend payment terms to 45-60 days",
              "Secure enhanced early payment discounts (3-5%)",
              "Establish volume-based pricing tiers",
              "Strengthen strategic partnership"
            ]
          }
        },
        performanceAnalytics: {
          financialMetrics: {
            totalSavings: 11248.52,
            savingsRate: 2.009023039828541,
            annualProjection: 44994.08,
            implementationCost: 15000,
            roiPercentage: 199.96,
            paybackPeriodMonths: 6.0
          },
          performanceIndicators: {
            optimizationAccuracy: 92,
            timeReduction: 80,
            vendorSatisfaction: 88,
            processEfficiency: 85
          }
        },
        cashFlowProjection: {
          initialCash: 2500000,
          minimumReserve: 500000,
          finalCashBalance: 1940751.48,
          totalPayments: 559900,
          totalSavings: 11248.52,
          cashUtilization: 22.4,
          reserveCompliance: true,
          cashFlowTimeline: [
            {
              paymentId: "INV-001",
              vendor: "Apex Steel Solutions",
              amount: 245000,
              runningBalance: 2255000,
              reserveCushion: 1755000,
              date: "2025-08-01",
              status: "scheduled",
              discountCaptured: 6125.0
            },
            {
              paymentId: "INV-002",
              vendor: "TechFlow Logistics",
              amount: 89500,
              runningBalance: 2165500,
              reserveCushion: 1665500,
              date: "2025-07-27",
              status: "scheduled",
              discountCaptured: 2685.0
            },
            {
              paymentId: "INV-005",
              vendor: "GlobalTech Components",
              amount: 134200,
              runningBalance: 2031300,
              reserveCushion: 1531300,
              date: "2025-08-06",
              status: "scheduled",
              discountCaptured: 2415.6
            },
            {
              paymentId: "INV-003",
              vendor: "DataSys IT Services",
              amount: 67800,
              runningBalance: 1963500,
              reserveCushion: 1463500,
              date: "2025-07-24",
              status: "scheduled",
              discountCaptured: 13.56
            },
            {
              paymentId: "INV-004",
              vendor: "QuickSupply Office",
              amount: 23400,
              runningBalance: 1940100,
              reserveCushion: 1440100,
              date: "2025-07-22",
              status: "scheduled",
              discountCaptured: 9.36
            }
          ]
        }
      };
    }
  };



  // Utility functions for data manipulation
  const exportData = () => {
    if (!dashboardData) return;
    
    const dataToExport = exportFormat === 'csv' ? convertToCSV(dashboardData) : JSON.stringify(dashboardData, null, 2);
    const blob = new Blob([dataToExport], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payopti-dashboard-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data.paymentSequence) return '';
    
    const headers = ['Position', 'Vendor Name', 'Amount', 'AI Score', 'VRS', 'Discount Rate', 'Payment Date', 'Status'];
    const rows = data.paymentSequence.map(payment => [
      payment.position,
      payment.vendorName,
      payment.amount,
      (payment.aiScore * 100).toFixed(1) + '%',
      payment.vrs.toFixed(1),
      payment.discountRate + '%',
      payment.paymentTiming,
      payment.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const filteredAndSortedPayments = () => {
    if (!dashboardData?.paymentSequence) return [];
    
    let filtered = dashboardData.paymentSequence.filter(payment => {
      const matchesSearch = payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00%';
    }
    return `${Number(value).toFixed(2)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-green-600 bg-green-100';
      case 'deferred': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: TrendingUp },
    { id: 'sequence', label: 'Payment Sequence', icon: Calendar },
    { id: 'comparison', label: 'Method Comparison', icon: BarChart3 },
    { id: 'vendors', label: 'Vendor Analysis', icon: Users },
    { id: 'negotiations', label: 'Negotiations', icon: MessageSquare },
    { id: 'analytics', label: 'Performance Analytics', icon: Target },
    { id: 'cashflow', label: 'Cash Flow', icon: DollarSign },
    { id: 'ai-insights', label: 'AI Insights', icon: Eye },
    { id: 'enhanced-comparison', label: 'Enhanced Results', icon: ArrowUp }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Payables</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {formatCurrency(dashboardData?.executiveSummary?.dashboardMetrics?.totalPayables || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Potential Savings</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(dashboardData?.executiveSummary?.dashboardMetrics?.potentialSavings || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Active Vendors</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {dashboardData?.executiveSummary?.dashboardMetrics?.activeVendors || 0}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Savings Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {formatPercentage(dashboardData?.executiveSummary?.dashboardMetrics?.savingsRate || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <Percent className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Score vs Payment Priority Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            AI Score vs Payment Priority
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboardData?.paymentSequence?.map(payment => ({
              vendor: payment.vendorName ? payment.vendorName.split(' ')[0] : 'Unknown',
              aiScore: (payment.aiScore * 100).toFixed(1),
              position: payment.position,
              amount: payment.amount / 1000
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => [
                name === 'aiScore' ? `${value}%` : name === 'amount' ? `$${value}K` : value,
                name === 'aiScore' ? 'AI Score' : name === 'amount' ? 'Amount ($K)' : 'Position'
              ]} />
              <Legend />
              <Bar yAxisId="left" dataKey="aiScore" fill="#8884d8" name="AI Score (%)" />
              <Bar yAxisId="right" dataKey="amount" fill="#82ca9d" name="Amount ($K)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Distribution Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            Vendor Distribution by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: 'Functional Suppliers',
                    value: dashboardData?.vendorAnalysis?.vendorDistribution?.functionalSuppliers?.length || 0,
                    fill: '#8884d8'
                  },
                  {
                    name: 'Transactional Vendors',
                    value: dashboardData?.vendorAnalysis?.vendorDistribution?.transactionalVendors?.length || 0,
                    fill: '#82ca9d'
                  },
                  {
                    name: 'Strategic Partners',
                    value: dashboardData?.vendorAnalysis?.vendorDistribution?.strategicPartners?.length || 0,
                    fill: '#ffc658'
                  }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Functional Suppliers', fill: '#8884d8' },
                  { name: 'Transactional Vendors', fill: '#82ca9d' },
                  { name: 'Strategic Partners', fill: '#ffc658' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategy Summary */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3 flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          Optimization Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl">
            <p className="text-sm font-semibold text-gray-700 mb-2">Strategy Used</p>
            <p className="text-base text-gray-900 font-medium">
              {dashboardData?.executiveSummary?.optimizationSummary?.strategyUsed}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-xl">
            <p className="text-sm font-semibold text-gray-700 mb-2">Payments Optimized</p>
            <p className="text-base text-gray-900 font-medium">
              {dashboardData?.executiveSummary?.optimizationSummary?.paymentsOptimized}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSequence = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vendors or invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="deferred">Deferred</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="position">Sort by Position</option>
              <option value="vendorName">Sort by Vendor</option>
              <option value="amount">Sort by Amount</option>
              <option value="aiScore">Sort by AI Score</option>
              <option value="vrs">Sort by VRS</option>
              <option value="discountRate">Sort by Discount</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredAndSortedPayments().length} of {dashboardData?.paymentSequence?.length || 0} payments
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Optimized Payment Sequence</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VRS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedPayments().map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{payment.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{payment.vendorName}</div>
                      <div className="text-xs text-gray-500">{payment.invoiceId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${payment.aiScore * 100}%`}}
                        ></div>
                      </div>
                      {(payment.aiScore * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${payment.vrs}%`}}
                        ></div>
                      </div>
                      {payment.vrs.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium text-green-600">
                      {formatPercentage(payment.discountRate)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(payment.discountCaptured)} saved
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paymentTiming}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => setSelectedVendor(payment.vendorId)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {(() => {
              const payment = dashboardData?.paymentSequence?.find(p => p.vendorId === selectedVendor);
              if (!payment) return <div>Payment not found</div>;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vendor</label>
                      <p className="text-sm text-gray-900">{payment.vendorName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Invoice ID</label>
                      <p className="text-sm text-gray-900">{payment.invoiceId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-sm text-gray-900">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">AI Score</label>
                      <p className="text-sm text-gray-900">{(payment.aiScore * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Reasoning</label>
                    <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded">{payment.reasoning}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">PayOpti</h3>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 mb-2">
            {formatCurrency(dashboardData?.traditionalComparison?.payopti?.totalSavings || 0)}
          </p>
          <p className="text-sm text-gray-600">
            {dashboardData?.traditionalComparison?.payopti?.method}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            VRS Preservation: {formatPercentage(dashboardData?.traditionalComparison?.payopti?.vrsPreservation || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avalanche Method</h3>
            <ArrowDown className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(dashboardData?.traditionalComparison?.avalanche?.totalSavings || 0)}
          </p>
          <p className="text-sm text-gray-600">
            {dashboardData?.traditionalComparison?.avalanche?.method}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            VRS Preservation: {formatPercentage(dashboardData?.traditionalComparison?.avalanche?.vrsPreservation || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Snowball Method</h3>
            <ArrowDown className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(dashboardData?.traditionalComparison?.snowball?.totalSavings || 0)}
          </p>
          <p className="text-sm text-gray-600">
            {dashboardData?.traditionalComparison?.snowball?.method}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            VRS Preservation: {formatPercentage(dashboardData?.traditionalComparison?.snowball?.vrsPreservation || 0)}
          </p>
        </div>
      </div>

      {/* Improvement Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">PayOpti Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            {dashboardData?.traditionalComparison?.improvementVsAvalanche >= 0 ? (
              <ArrowUp className="h-6 w-6 text-green-600 mr-3" />
            ) : (
              <ArrowDown className="h-6 w-6 text-red-600 mr-3" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">vs Avalanche Method</p>
              <p className={`text-lg font-bold ${
                dashboardData?.traditionalComparison?.improvementVsAvalanche >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {dashboardData?.traditionalComparison?.improvementVsAvalanche >= 0 ? '+' : ''}
                {formatPercentage(dashboardData?.traditionalComparison?.improvementVsAvalanche || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {dashboardData?.traditionalComparison?.improvementVsSnowball >= 0 ? (
              <ArrowUp className="h-6 w-6 text-green-600 mr-3" />
            ) : (
              <ArrowDown className="h-6 w-6 text-red-600 mr-3" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">vs Snowball Method</p>
              <p className={`text-lg font-bold ${
                dashboardData?.traditionalComparison?.improvementVsSnowball >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {dashboardData?.traditionalComparison?.improvementVsSnowball >= 0 ? '+' : ''}
                {formatPercentage(dashboardData?.traditionalComparison?.improvementVsSnowball || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendorAnalysis = () => (
    <div className="space-y-6">
      {/* Vendor Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Strategic Partners</h4>
          <div className="space-y-3">
            {dashboardData?.vendorAnalysis?.vendorDistribution?.strategicPartners?.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{vendor.vendorName}</p>
                  <p className="text-sm text-gray-600">VRS: {vendor.vrsScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(vendor.annualSpend)}</p>
                  <p className="text-xs text-gray-500">Annual Spend</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Functional Suppliers</h4>
          <div className="space-y-3">
            {dashboardData?.vendorAnalysis?.vendorDistribution?.functionalSuppliers?.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{vendor.vendorName}</p>
                  <p className="text-sm text-gray-600">VRS: {vendor.vrsScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(vendor.annualSpend)}</p>
                  <p className="text-xs text-gray-500">Annual Spend</p>
                </div>
              </div>
            )) || []}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Transactional Vendors</h4>
          <div className="space-y-3">
            {dashboardData?.vendorAnalysis?.vendorDistribution?.transactionalVendors?.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{vendor.vendorName}</p>
                  <p className="text-sm text-gray-600">VRS: {vendor.vrsScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(vendor.annualSpend)}</p>
                  <p className="text-xs text-gray-500">Annual Spend</p>
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>

      {/* Vendor Analysis Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VRS Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">VRS Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.paymentSequence?.map(payment => ({
              vendor: payment.vendorName ? payment.vendorName.split(' ')[0] : 'Unknown',
              vrs: payment.vrs,
              aiScore: (payment.aiScore * 100).toFixed(1)
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => [
                name === 'vrs' ? value : `${value}%`,
                name === 'vrs' ? 'VRS Score' : 'AI Score'
              ]} />
              <Legend />
              <Bar yAxisId="left" dataKey="vrs" fill="#8884d8" name="VRS Score" />
              <Bar yAxisId="right" dataKey="aiScore" fill="#82ca9d" name="AI Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Annual Spend by Vendor Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Spend by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              {
                category: 'Strategic Partners',
                spend: dashboardData?.vendorAnalysis?.vendorDistribution?.strategicPartners?.reduce((sum, vendor) => sum + vendor.annualSpend, 0) / 1000000 || 0,
                count: dashboardData?.vendorAnalysis?.vendorDistribution?.strategicPartners?.length || 0
              },
              {
                category: 'Functional Suppliers',
                spend: dashboardData?.vendorAnalysis?.vendorDistribution?.functionalSuppliers?.reduce((sum, vendor) => sum + vendor.annualSpend, 0) / 1000000 || 0,
                count: dashboardData?.vendorAnalysis?.vendorDistribution?.functionalSuppliers?.length || 0
              },
              {
                category: 'Transactional Vendors',
                spend: dashboardData?.vendorAnalysis?.vendorDistribution?.transactionalVendors?.reduce((sum, vendor) => sum + vendor.annualSpend, 0) / 1000000 || 0,
                count: dashboardData?.vendorAnalysis?.vendorDistribution?.transactionalVendors?.length || 0
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => [
                name === 'spend' ? `$${value}M` : value,
                name === 'spend' ? 'Annual Spend' : 'Vendor Count'
              ]} />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" fill="#8884d8" name="Annual Spend ($M)" />
              <Bar yAxisId="right" dataKey="count" fill="#82ca9d" name="Vendor Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">High Risk</h4>
            <p className="text-2xl font-bold text-red-600">
              {dashboardData?.vendorAnalysis?.riskAnalysis?.highRiskVendors?.length || 0}
            </p>
            <p className="text-sm text-gray-600">vendors</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Medium Risk</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {dashboardData?.vendorAnalysis?.riskAnalysis?.mediumRiskVendors?.length || 0}
            </p>
            <p className="text-sm text-gray-600">vendors</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Low Risk</h4>
            <p className="text-2xl font-bold text-green-600">
              {dashboardData?.vendorAnalysis?.riskAnalysis?.lowRiskVendors?.length || 0}
            </p>
            <p className="text-sm text-gray-600">vendors</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNegotiations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Negotiation Strategies</h3>
        </div>
        <div className="p-6">
          {Object.entries(dashboardData?.negotiationStrategies || {}).map(([vendorId, strategy]) => (
            <div key={vendorId} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:mb-0">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {dashboardData?.paymentSequence?.find(p => p.vendorId === vendorId)?.vendorName || vendorId}
                </h4>
                <button
                  onClick={() => setShowNegotiation(showNegotiation === vendorId ? null : vendorId)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showNegotiation === vendorId ? 'Hide Details' : 'View Strategy'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approach</p>
                  <p className="text-base text-gray-900 capitalize">{strategy.approach}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Probability</p>
                  <p className="text-base text-gray-900">{(strategy.successProbability * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Relationship</p>
                  <p className="text-base text-gray-900">
                    {strategy.relationshipContext?.yearsOfRelationship} years
                  </p>
                </div>
              </div>

              {showNegotiation === vendorId && (
                <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Key Leverage Points</h5>
                    <ul className="space-y-2">
                      {strategy.keyLeveragePoints?.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Negotiation Goals</h5>
                    <ul className="space-y-2">
                      {strategy.negotiationGoals?.map((goal, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Draft Email</h5>
                    <div className="bg-white p-4 rounded border">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {strategy.draftEmail}
                      </pre>
                    </div>
                    <div className="mt-3 flex space-x-3">
                      <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </button>
                      <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className={`text-2xl font-bold ${
                (dashboardData?.performanceAnalytics?.financialMetrics?.roiPercentage || 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatPercentage(dashboardData?.performanceAnalytics?.financialMetrics?.roiPercentage || 0)}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${
              (dashboardData?.performanceAnalytics?.financialMetrics?.roiPercentage || 0) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payback Period</p>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData?.performanceAnalytics?.financialMetrics?.paybackPeriodMonths?.toFixed(1) || 0} months
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Utilization</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPercentage(dashboardData?.cashFlowProjection?.cashUtilization || 0)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Final Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData?.cashFlowProjection?.finalCashBalance || 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Performance Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Indicators Radar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Indicators</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={[
              {
                subject: 'Optimization Accuracy',
                A: dashboardData?.performanceAnalytics?.performanceIndicators?.optimizationAccuracy || 0,
                fullMark: 100,
              },
              {
                subject: 'Time Reduction',
                A: dashboardData?.performanceAnalytics?.performanceIndicators?.timeReduction || 0,
                fullMark: 100,
              },
              {
                subject: 'Vendor Satisfaction',
                A: dashboardData?.performanceAnalytics?.performanceIndicators?.vendorSatisfaction || 0,
                fullMark: 100,
              },
              {
                subject: 'Process Efficiency',
                A: dashboardData?.performanceAnalytics?.performanceIndicators?.processEfficiency || 0,
                fullMark: 100,
              },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Metrics Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              {
                name: 'Total Savings',
                value: (dashboardData?.performanceAnalytics?.financialMetrics?.totalSavings || 0) / 1000,
                fill: '#10b981'
              },
              {
                name: 'Annual Projection',
                value: (dashboardData?.performanceAnalytics?.financialMetrics?.annualProjection || 0) / 1000,
                fill: '#3b82f6'
              },
              {
                name: 'Implementation Cost',
                value: (dashboardData?.performanceAnalytics?.financialMetrics?.implementationCost || 0) / 1000,
                fill: '#ef4444'
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}K`, 'Amount']} />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="space-y-6">
      {/* Cash Flow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Initial Cash</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData?.cashFlowProjection?.initialCash || 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(dashboardData?.cashFlowProjection?.totalPayments || 0)}
              </p>
            </div>
            <ArrowDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Final Balance</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData?.cashFlowProjection?.finalCashBalance || 0)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPercentage(dashboardData?.cashFlowProjection?.cashUtilization || 0)}
              </p>
            </div>
            <Percent className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Cash Flow Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Timeline Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData?.cashFlowProjection?.cashFlowTimeline?.map((flow, index) => ({
              date: flow.date,
              runningBalance: flow.runningBalance / 1000000,
              reserveCushion: flow.reserveCushion / 1000000,
              payment: flow.amount / 1000
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => [
                name === 'runningBalance' || name === 'reserveCushion' ? `$${value}M` : `$${value}K`,
                name === 'runningBalance' ? 'Running Balance' : name === 'reserveCushion' ? 'Reserve Cushion' : 'Payment'
              ]} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="runningBalance" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="reserveCushion" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Bar yAxisId="right" dataKey="payment" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Discount Capture Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Capture by Vendor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.cashFlowProjection?.cashFlowTimeline?.map(flow => ({
              vendor: flow.vendor ? flow.vendor.split(' ')[0] : 'Unknown',
              discount: flow.discountCaptured,
              amount: flow.amount / 1000
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
              <Tooltip formatter={(value, name) => [
                name === 'discount' ? `$${value}` : `$${value}K`,
                name === 'discount' ? 'Discount' : 'Amount'
              ]} />
              <Legend />
              <Bar yAxisId="left" dataKey="discount" fill="#10b981" name="Discount Captured" />
              <Bar yAxisId="right" dataKey="amount" fill="#3b82f6" name="Payment Amount ($K)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Timeline Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cash Flow Timeline Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Running Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reserve Cushion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount Captured
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.cashFlowProjection?.cashFlowTimeline?.map((flow, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flow.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flow.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(flow.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(flow.runningBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(flow.reserveCushion)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(flow.discountCaptured)}
                  </td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
            <Eye className="h-4 w-4 text-white" />
          </div>
          AI-Powered Vendor Insights
        </h3>
        
        {dashboardData?.aiInsights ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(dashboardData.aiInsights).map(([vendorId, insights]) => (
              <div key={vendorId} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{vendorId}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      Rank: {insights.percentile_rank || 0}%
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      insights.negotiation_readiness === 'high' 
                        ? 'bg-green-100 text-green-800' 
                        : insights.negotiation_readiness === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {insights.negotiation_readiness || 'unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Strengths</h5>
                    <div className="flex flex-wrap gap-2">
                      {(insights.key_strengths || []).map((strength, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Improvement Areas</h5>
                    <div className="flex flex-wrap gap-2">
                      {(insights.improvement_areas || []).map((area, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Relationship Trajectory</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      insights.relationship_trajectory === 'improving' 
                        ? 'bg-green-100 text-green-800' 
                        : insights.relationship_trajectory === 'stable'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {insights.relationship_trajectory || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Insights Available</h3>
            <p className="text-gray-600">AI insights data not found in the loaded dataset</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEnhancedComparison = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-3 flex items-center justify-center">
            <ArrowUp className="h-4 w-4 text-white" />
          </div>
          Enhanced Comparison Results
        </h3>
        
        {dashboardData?.enhancedComparisonResults ? (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-1">PayOpti Wins</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.enhancedComparisonResults.summary?.payopti_wins || 0}
                </p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-1">Traditional Wins</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData.enhancedComparisonResults.summary?.traditional_wins || 0}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((dashboardData.enhancedComparisonResults.summary?.payopti_win_rate || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-1">Avg Improvement</p>
                <p className={`text-2xl font-bold ${
                  (dashboardData.enhancedComparisonResults.summary?.average_savings_improvement || 0) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {(dashboardData.enhancedComparisonResults.summary?.average_savings_improvement || 0).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Detailed Results */}
            {dashboardData.enhancedComparisonResults.detailedResults && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Scenario Results</h4>
                <div className="space-y-4">
                  {Object.entries(dashboardData.enhancedComparisonResults.detailedResults).map(([scenario, results]) => (
                    <div key={scenario} className="bg-white p-4 rounded-lg border">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {scenario.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Winner: </span>
                          <span className={`font-semibold ${
                            results.winner === 'payopti' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {results.winner || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Savings Difference: </span>
                          <span className={`font-semibold ${
                            (results.savings_difference || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(results.savings_difference || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Performance: </span>
                          <span className={`font-semibold ${
                            (results.performance_score || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {(results.performance_score || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <ArrowUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Enhanced Comparison Data</h3>
            <p className="text-gray-600">Enhanced comparison results not found in the loaded dataset</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (!dashboardData) {
      return (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Loaded</h3>
          <p className="text-gray-600">Please specify a data folder and load PayOpti results</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'sequence': return renderPaymentSequence();
      case 'comparison': return renderComparison();
      case 'vendors': return renderVendorAnalysis();
      case 'negotiations': return renderNegotiations();
      case 'analytics': return renderAnalytics();
      case 'cashflow': return renderCashFlow();
      case 'ai-insights': return renderAIInsights();
      case 'enhanced-comparison': return renderEnhancedComparison();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl mr-3 shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  PayOpti Dashboard
                </h1>
                <p className="text-xs text-gray-500 -mt-1">AI-Powered Payment Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
              <button 
                onClick={exportData}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button 
                onClick={loadDataFromFolder}
                disabled={loading || !baseAddress}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

              {/* Data Folder Input */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Data Loading Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* localStorage Status */}
          {lastLoadedPath && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-800">Session Restored</h3>
                    <p className="text-sm text-green-700 mt-1">Last loaded: {lastLoadedPath}</p>
                    {selectedModeObj && (
                      <p className="text-sm text-green-700">Mode: {selectedModeObj.name}</p>
                    )}
                    {baseAddress && (
                      <p className="text-sm text-green-700">Base directory: {baseAddress}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={clearLocalStorage}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Clear Cache
                  </button>
                  <button
                    onClick={restoreLastSession}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Base Directory Input */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <label htmlFor="baseAddress" className="block text-sm font-semibold text-gray-800 mb-2">
                  Base Directory Path (contains mode folders)
                </label>
                <input
                  type="text"
                  id="baseAddress"
                  value={baseAddress}
                  onChange={(e) => setBaseAddress(e.target.value)}
                  placeholder="address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Base directory containing mode subfolders (e.g., "address" which contains "mode_aggressive_optimization/", etc.)
                </p>
              </div>
            </div>
          

        </div>

        {/* Mode Selection */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Select Optimization Mode</h3>
              <p className="text-sm text-gray-600">Choose from available PayOpti optimization modes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <select
                value={selectedMode}
                onChange={(e) => loadDataFromMode(e.target.value)}
                disabled={loading || !baseAddress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
              >
                <option value="">Select a mode...</option>
                
                {/* Individual Optimization Modes */}
                <optgroup label="🎯 Individual Optimization Modes">
                  {availableModes.filter(m => m.category === 'optimization').map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name}
                    </option>
                  ))}
                </optgroup>
                
                {/* Analysis Mode */}
                <optgroup label="🧪 Analysis Mode">
                  {availableModes.filter(m => m.category === 'analysis').map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            {selectedModeObj && (
              <div className="flex items-center px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-md">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div className="text-sm">
                  <div className="font-semibold text-green-800">{selectedModeObj.name}</div>
                  <div className="text-green-600">Path: {lastLoadedPath}</div>
                </div>
              </div>
            )}
          </div>
          
          {!baseAddress && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-yellow-800">
                  Please specify a base directory path first
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-red-800">Error Loading Data</div>
                <div className="text-red-600 mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
            <nav className="flex space-x-1 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-6 border-b-2 font-semibold text-sm rounded-t-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-700 bg-white shadow-lg'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayOptiDashboard;
