import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { 
  Rocket, 
  Zap, 
  Shield, 
  Star, 
  TrendingUp, 
  Users,
  Video,
  FileText,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Content',
      description: 'Generate course content, videos, quizzes, and more with advanced AI technology.',
    },
    {
      icon: Video,
      title: 'Multi-Format Support',
      description: 'Create courses in various formats including videos, documents, interactive content, and more.',
    },
    {
      icon: Shield,
      title: 'Professional Quality',
      description: 'Ensure high-quality content with AI-driven optimization and professional templates.',
    },
    {
      icon: TrendingUp,
      title: 'Trending Topics',
      description: 'Stay current with AI-curated trending topics and in-demand skills.',
    },
    {
      icon: Users,
      title: 'Collaborative Tools',
      description: 'Work with teams and collaborate in real-time on course development.',
    },
    {
      icon: Star,
      title: 'Engaging Content',
      description: 'Create interactive and engaging learning experiences that keep students motivated.',
    },
  ];

  const stats = [
    { label: 'Courses Created', value: '12,458+' },
    { label: 'Active Learners', value: '89,234+' },
    { label: 'AI Content Generated', value: '4.2TB' },
    { label: 'Average Rating', value: '4.7/5.0' },
  ];

  const trendingTopics = [
    'Web3 Development',
    'AI Prompt Engineering',
    'Cybersecurity',
    'Digital Marketing',
    'UX/UI Design',
    'Data Analytics',
    'Cloud Computing',
    'Blockchain',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Any Course With
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your knowledge into engaging courses with our AI-powered platform. 
              Generate content, videos, quizzes, and more in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/create-course"
                  className="btn bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
                >
                  <Rocket className="h-5 w-5" />
                  Start Creating
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Course Creators
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and deliver outstanding courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Topics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending & Rare Skills
            </h2>
            <p className="text-xl text-gray-600">
              Create courses on the most in-demand topics
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {trendingTopics.map((topic, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
              >
                {topic}
              </span>
            ))}
          </div>

          <div className="text-center">
            <Link
              to={user ? "/create-course" : "/register"}
              className="btn btn-primary text-lg px-8 py-3"
            >
              <Rocket className="h-5 w-5" />
              Start Creating Your Course
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Create your first course in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Describe Your Course',
                description: 'Tell our AI what you want to teach and who your audience is.',
              },
              {
                step: '2',
                title: 'AI Generates Content',
                description: 'Our AI creates the course outline, lessons, and multimedia content.',
              },
              {
                step: '3',
                title: 'Review & Publish',
                description: 'Customize the content and publish your course to the world.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your First AI-Powered Course?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of instructors who are transforming education with AI
          </p>
          <Link
            to={user ? "/create-course" : "/register"}
            className="btn bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 inline-flex items-center"
          >
            <Rocket className="h-5 w-5 mr-2" />
            {user ? 'Create New Course' : 'Get Started Free'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
