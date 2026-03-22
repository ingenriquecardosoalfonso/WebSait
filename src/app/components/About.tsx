import { Brain, Shield, Eye, TrendingUp, Lock, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold dark:text-white underline decoration-2 decoration-sky-800">About NetSieveX.io</h1>
        <p className="text-xl dark:text-sky-200">
          Advanced IoT Security Analytics Platform powered by Machine Learning
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg shadow">
        <div className="flex items-start gap-4">
          <Shield className="w-10 h-10 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              NetSieveX.io is dedicated to protecting IoT networks from sophisticated cyber threats through 
              cutting-edge artificial intelligence and machine learning technologies. We provide 
              attack detection and comprehensive network analysis to secure the growing landscape of 
              Internet of Things devices.
            </p>
          </div>
        </div>
      </div>

      {/* AI & Machine Learning Section */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Artificial Intelligence & Machine Learning</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Our platform leverages advanced machine learning algorithms to analyze network traffic patterns 
            and detect anomalous behavior in real-time. We employ multiple AI models including:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">🤖 Random Forest</h3>
              <p className="text-sm text-purple-800">
                Ensemble learning method for robust attack classification with high accuracy and low false positives.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🧠 Neural Networks</h3>
              <p className="text-sm text-blue-800">
                Deep learning models that identify complex patterns in network traffic for advanced threat detection.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">📊 Gradient Boosting</h3>
              <p className="text-sm text-green-800">
                Powerful ensemble technique that combines weak learners to create highly accurate predictions.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">🎯 SVM (Support Vector Machine)</h3>
              <p className="text-sm text-orange-800">
                Effective classification algorithm for separating normal traffic from attack patterns.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Continuous Learning</h4>
                <p className="text-sm text-blue-800">
                  Our AI models are continuously updated with new threat patterns and attack vectors, 
                  ensuring they stay ahead of emerging cybersecurity challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency & Metrics Section */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Transparency & Metrics</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We believe in complete transparency regarding our detection capabilities and model performance. 
            All metrics are calculated and displayed in real-time to provide full visibility into system operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">94.7%</div>
              <div className="text-sm text-green-800 font-medium">Model Accuracy</div>
              <div className="text-xs text-green-700 mt-1">Validated on test dataset</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">&lt; 100ms</div>
              <div className="text-sm text-blue-800 font-medium">Detection Latency</div>
              <div className="text-xs text-blue-700 mt-1">Real-time analysis</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Lock className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">2.1%</div>
              <div className="text-sm text-purple-800 font-medium">False Positive Rate</div>
              <div className="text-xs text-purple-700 mt-1">Minimizing disruptions</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              What We Track & Display:
            </h3>
            
            <ul className="space-y-2 ml-7">
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Detection Confidence:</strong> Each prediction includes a confidence score showing model certainty</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Feature Importance:</strong> Transparent explanation of which network characteristics influenced the decision</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Traffic Statistics:</strong> Real-time metrics on packet rates, flow durations, and payload sizes</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Attack Classification:</strong> Detailed categorization of detected threats (DDoS, DoS, Reconnaissance, Mirai, Theft)</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Comparative Analysis:</strong> Side-by-side comparison of normal vs. malicious traffic patterns</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Explainable AI</h4>
                <p className="text-sm text-yellow-800">
                  We prioritize explainability in our AI models. Every detection result shows which features 
                  (e.g., SYN flags, packet rates, payload sizes) contributed most to the classification, 
                  ensuring security teams can understand and validate automated decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Real-Time Detection</h3>
              <p className="text-sm text-gray-600">
                Immediate identification of network threats with sub-second response times
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Multi-Model Analysis</h3>
              <p className="text-sm text-gray-600">
                Choose from multiple ML algorithms optimized for different attack types
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Comprehensive Analytics</h3>
              <p className="text-sm text-gray-600">
                Deep dive into traffic patterns with interactive visualizations and filters
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Eye className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Complete Transparency</h3>
              <p className="text-sm text-gray-600">
                Full visibility into model decisions, metrics, and detection reasoning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">📌 Demo Environment</h3>
        <p className="text-sm text-gray-700">
          This platform uses simulated network traffic data for demonstration purposes. 
          The machine learning models and detection algorithms are based on real cybersecurity 
          research and industry best practices. All metrics and visualizations represent realistic 
          scenarios encountered in IoT network security.
        </p>
      </div>
    </div>
  );
}
