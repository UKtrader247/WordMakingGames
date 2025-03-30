import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, Facebook, Twitter, Instagram } from 'lucide-react';
import SocialLinks from '../../components/SocialLinks';
import { blogPosts } from './blogData';

function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-4 md:p-8 pt-12 md:pt-16">
      {/* Social Links */}
      <SocialLinks />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center mb-8">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-4">Word Making Games Blog</h1>
          <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
            Insights on language learning, vocabulary building, and the science behind word games
          </p>
        </header>

        <main className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.author}</span>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        <div className="bg-white p-8 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Get the latest blog posts and word game tips delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 border border-gray-300 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>

        <footer className="text-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="font-medium text-blue-800">&copy; {new Date().getFullYear()} Word Making Games</p>
            <p className="mt-2 text-gray-600 text-sm">
              Improve your vocabulary with our educational word games and resources.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                to="/blog"
                className="text-blue-500 hover:text-blue-700 transition font-medium"
              >
                Blog
              </Link>
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-700 transition"
              >
                About
              </Link>
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-700 transition"
              >
                Privacy
              </Link>
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-700 transition"
              >
                Contact
              </Link>
            </div>
            <div className="mt-6 flex justify-center space-x-6">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-800">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default BlogPage; 