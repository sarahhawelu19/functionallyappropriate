import React from 'react';
import { ArrowRight, Calendar, Target, FileText, BarChart3, CheckCircle, Clock, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="text-teal" size={24} />,
      title: 'Smart Scheduling',
      description: 'Automatically track IEP due dates, progress reports, and meetings',
      color: 'teal'
    },
    {
      icon: <Target className="text-green" size={24} />,
      title: 'Goal Writing',
      description: 'Create measurable IEP goals with templates and historical data',
      color: 'green'
    },
    {
      icon: <FileText className="text-gold" size={24} />,
      title: 'Report Drafting',
      description: 'Generate professional reports with AI-assisted writing tools',
      color: 'gold'
    },
    {
      icon: <BarChart3 className="text-purple" size={24} />,
      title: 'Student Dashboard',
      description: 'Comprehensive view of student progress and data insights',
      color: 'purple'
    }
  ];

  const benefits = [
    'Reduce administrative time by 60%',
    'Never miss an IEP deadline again',
    'Streamline team collaboration',
    'Generate compliant documentation',
    'Track student progress effectively'
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-xl font-semibold">BetterSped</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/create-account" 
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Create Account
              </Link>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple/90 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Main Question */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Drowning in{' '}
              <span className="relative">
                <span className="text-purple">IEP paperwork</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-purple/20 rounded-full"></div>
              </span>
              {' '}and deadlines?
            </h1>

            {/* Sub-heading */}
            <p className="text-xl sm:text-2xl text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your special education workflow with an AI-powered platform that centralizes 
              scheduling, goal-writing, and report drafting—so you can focus on what matters most: 
              <span className="text-text-primary font-medium"> your students</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/create-account"
                className="inline-flex items-center px-8 py-4 bg-purple text-white text-lg font-semibold rounded-xl hover:bg-purple/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 border-2 border-purple text-purple text-lg font-semibold rounded-xl hover:bg-purple hover:text-white transition-all duration-200"
              >
                View Live Demo
              </Link>
            </div>

            {/* Visual Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-6 bg-bg-secondary rounded-2xl border border-border hover:border-purple/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-xl bg-${feature.color}/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-teal/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gold/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
              Why Special Education Teams Choose BetterSped
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Join hundreds of educators who have transformed their IEP management process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-green" size={24} />
                  </div>
                  <span className="text-lg text-text-primary">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-bg-primary rounded-2xl p-8 shadow-xl border border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Today's Overview</h3>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-purple" size={16} />
                      <span className="text-sm text-text-secondary">Live Dashboard</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">3</div>
                      <div className="text-sm text-red-600 dark:text-red-400">IEP Due</div>
                    </div>
                    <div className="p-4 bg-green/10 rounded-lg border border-green/20">
                      <div className="text-2xl font-bold text-green">12</div>
                      <div className="text-sm text-green">Goals Met</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="text-purple" size={16} />
                        <span className="text-sm">IEP Meeting - John Smith</span>
                      </div>
                      <span className="text-xs text-text-secondary">2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-gold" size={16} />
                        <span className="text-sm">Progress Report Due</span>
                      </div>
                      <span className="text-xs text-text-secondary">Tomorrow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
            Ready to Reclaim Your Time?
          </h2>
          <p className="text-lg text-text-secondary mb-10">
            Start managing your IEP caseload more efficiently today. No setup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create-account"
              className="inline-flex items-center px-10 py-5 bg-purple text-white text-xl font-semibold rounded-xl hover:bg-purple/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Create Your Account
              <ArrowRight className="ml-3" size={24} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-10 py-5 border-2 border-purple text-purple text-xl font-semibold rounded-xl hover:bg-purple hover:text-white transition-all duration-200"
            >
              Explore the Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-purple rounded-md flex items-center justify-center">
                <Sparkles className="text-white" size={14} />
              </div>
              <span className="text-lg font-semibold">BetterSped</span>
            </div>
            <div className="text-text-secondary text-sm">
              © 2025 BetterSped. Empowering special education professionals.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;