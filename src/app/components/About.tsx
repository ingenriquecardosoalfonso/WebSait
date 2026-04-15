import { useState } from 'react';
import {Brain,Shield,Eye,CheckCircle,AlertCircle,Cpu,Network,GitBranch,} from 'lucide-react';

export default function About(): import("react/jsx-runtime").JSX.Element {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Thank you for your feedback!');
    setFeedback({ name: '', email: '', message: '' });
  };

  const cardStyle = {
    backgroundColor: 'var(--card)',
    border: '0.5px solid var(--border)',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-wide text-foreground">About NetSieveX.io</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Advanced IoT Security Analytics Platform powered by Machine Learning
        </p>
      </div>

      {/* Mission Statement */}
      <div className="rounded p-6" style={cardStyle}>
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Our Mission</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              NetSieveX.io is dedicated to protecting IoT networks from sophisticated cyber threats through
              artificial intelligence and machine learning. We provide attack detection and comprehensive
              network analysis to help secure the growing landscape of Internet of Things devices.
            </p>
          </div>
        </div>
      </div>

      {/* AI & Machine Learning Section */}
      <div className="rounded p-6" style={cardStyle}>
        <div className="flex items-start gap-4 mb-6">
          <Brain className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Artificial Intelligence & Machine Learning
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Our platform applies multiple machine learning models to classify IoT network traffic and
              identify suspicious behavior. Each model contributes a different analytical strength, helping
              improve detection quality, interpretability, and robustness across varied attack patterns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded p-6" style={cardStyle}>
            <div className="flex items-start gap-3">
              <Cpu className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Random Forest</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  An ensemble model that combines multiple decision trees to improve stability and accuracy
                  for IoT attack classification.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded p-6" style={cardStyle}>
            <div className="flex items-start gap-3">
              <Network className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  KNN (K-Nearest Neighbors)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  A similarity-based model that classifies traffic by comparing each network flow with the
                  most similar known examples in the dataset.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded p-6" style={cardStyle}>
            <div className="flex items-start gap-3">
              <GitBranch className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Decision Tree</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  A tree-based model that splits traffic features step by step, making predictions easier to
                  interpret and explain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency & Metrics Section */}
      <div className="rounded p-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-green-600 flex-shrink-0" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Transparency & Metrics
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            We believe in complete transparency regarding our detection capabilities and model performance.
            All metrics are calculated and displayed to provide full visibility into system operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg" style={cardStyle}>
              <Cpu className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-xl font-bold text-gray-800 dark:text-white">99.37%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Random Forest</div>
              <div className="text-xs text-gray-500 mt-1">Model Accuracy</div>
            </div>

            <div className="text-center p-4 rounded-lg" style={cardStyle}>
              <GitBranch className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <div className="text-xl font-bold text-gray-800 dark:text-white">99.20%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Decision Tree</div>
              <div className="text-xs text-gray-500 mt-1">Model Accuracy</div>
            </div>

            <div className="text-center p-4 rounded-lg" style={cardStyle}>
              <Network className="w-10 h-10 text-pink-500 mx-auto mb-3" />
              <div className="text-xl font-bold text-gray-800 dark:text-white">98.91%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                KNN
              </div>
              <div className="text-xs text-gray-500 mt-1">Model Accuracy</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                What We Track & Display:
              </h3>
            </div>

            <ul className="space-y-2 ml-2">
              <li className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="text-blue-600">• </span>
                <span>
                  <strong>Detection Confidence:</strong> Each prediction includes a confidence score showing model Accuracy
                </span>
              </li>
              <li className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="text-blue-600">• </span>
                <span>
                  <strong>Feature Importance:</strong> Transparent explanation of which network characteristics influenced the decision
                </span>
              </li>
              <li className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="text-blue-600">• </span>
                <span>
                  <strong>Traffic Statistics:</strong> Metrics on packet rates, flow durations, and payload sizes
                </span>
              </li>
              <li className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="text-blue-600">• </span>
                <span>
                  <strong>Attack Classification:</strong> Detailed categorization of detected traffic such as DOS SYN Hping, ARP Poisoning, NMAP Scan, and Normal Traffic
                </span>
              </li>
              <li className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="text-blue-600">• </span>
                <span>
                  <strong>Comparative Analysis:</strong> Side-by-side comparison of normal vs. malicious traffic patterns
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded p-6" style={cardStyle}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-pink-700 dark:text-pink-400 mb-1">Explainable AI</h4>
                <p className="text-sm text-pink-700 dark:text-pink-300 leading-relaxed">
                  We prioritize explainability in our AI models. Every detection result shows which features
                  (for example SYN flags, packet rates, and payload sizes) contributed most to the
                  classification, helping security teams understand and validate automated decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="rounded p-6" style={cardStyle}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Platform Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded p-6" style={cardStyle}>
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Real-Time Detection</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Immediate identification of network threats with sub-second response times
              </p>
            </div>
          </div>

          <div className="rounded p-6" style={cardStyle}>
            <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Multi-Model Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Choose from multiple ML algorithms optimized for different attack types
              </p>
            </div>
          </div>

          <div className="rounded p-6" style={cardStyle}>
            <Eye className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Comprehensive Analytics</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Deep dive into traffic patterns with interactive visualizations and filters
              </p>
            </div>
          </div>

          <div className="rounded p-6" style={cardStyle}>
            <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Complete Transparency</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Full visibility into model decisions, metrics, and detection reasoning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="rounded p-6" style={cardStyle}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Feedback Form</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
          We’d love to hear your thoughts, suggestions, or questions about NetSieveX.io.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={feedback.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-white bg-transparent border outline-none"
              style={cardStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={feedback.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-white bg-transparent border outline-none"
              style={cardStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={feedback.message}
              onChange={handleChange}
              placeholder="Write your feedback here..."
              rows={5}
              required
              className="w-full rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-white bg-transparent border outline-none resize-none"
              style={cardStyle}
            />
          </div>

          {successMessage && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-sm font-medium text-white shadow transition hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #2563eb, #7c3aed)' }}
          >
            Submit Feedback
          </button>
        </form>
      </div>

      <div className="rounded p-6" style={cardStyle}>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Powered by Real Data</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          NETSIEVEX.IO is powered by real IoT network traffic data from the RT-IoT2022 Dataset, sourced
          via the UCI Machine Learning Repository.
          <br /><br />
          Our machine learning models are built on established cybersecurity research and industry best
          practices, enabling accurate detection of modern threats.
          <br /><br />
          All metrics and visualizations reflect authentic network behavior, providing a realistic and
          actionable view of IoT security risks.
        </p>
      </div>
    </div>
  );
}