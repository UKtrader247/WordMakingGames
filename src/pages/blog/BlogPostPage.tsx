import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Bookmark, ThumbsUp } from 'lucide-react';
import SocialLinks from '../../components/SocialLinks';

// Import blog posts data (this would typically come from an API)
// For demo purposes, we'll import the sample data from a mock file
import { blogPosts, BlogPost } from './blogData';

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // In a real application, this would be an API call
    // For this demo, we'll simulate loading from our mock data
    setLoading(true);
    
    setTimeout(() => {
      const foundPost = blogPosts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Find related posts (same tags)
        const related = blogPosts
          .filter(p => p.id !== foundPost.id)
          .filter(p => p.tags.some(tag => foundPost.tags.includes(tag)))
          .slice(0, 2);
        
        setRelatedPosts(related);
      } else {
        // Post not found
        navigate('/blog');
      }
      
      setLoading(false);
    }, 500); // Simulate network delay
    
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="animate-pulse text-blue-600 text-xl">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="text-red-600 text-xl">Post not found</div>
      </div>
    );
  }

  // Default styles if not provided in the post
  const defaultStyles = {
    lineHeight: '1.8',
    headingMargin: '2rem 0 1rem 0',
    paragraphSpacing: '1.5rem 0'
  };

  // Combine default styles with any custom styles from the post
  const styles = {
    ...defaultStyles,
    ...(post.styles || {})
  };

  // Create a style block for the blog content
  const contentStyles = `
    .blog-content h2 {
      margin: ${styles.headingMargin};
      font-size: 1.5rem;
      font-weight: 700;
      color: #2a52e2;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
    
    .blog-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1d4ed8;
      margin: 1.5rem 0 0.75rem 0;
    }
    
    .blog-content p {
      margin: ${styles.paragraphSpacing};
      line-height: ${styles.lineHeight};
      color: #334155;
      font-size: 1.05rem;
    }

    .blog-content p:first-of-type {
      font-size: 1.2rem;
      color: #1e293b;
      font-weight: 500;
    }
    
    .blog-content {
      max-width: 100%;
      overflow-wrap: break-word;
      letter-spacing: 0.01em;
    }
    
    .blog-content ul {
      margin: 1rem 0 1.5rem 1.5rem;
      list-style-type: disc;
    }
    
    .blog-content li {
      margin-bottom: 0.75rem;
      line-height: ${styles.lineHeight};
    }
    
    .blog-content em {
      color: #2a52e2;
      font-style: italic;
    }
    
    @media (min-width: 768px) {
      .blog-content {
        padding: 0 1rem;
      }
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-4 md:p-8 pt-12 md:pt-16">
      {/* Custom styles */}
      <style>{contentStyles}</style>
      
      {/* Social Links */}
      <SocialLinks />
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center mb-8">
            <Link to="/blog" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors">
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="h-64 md:h-80 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // If the image URL is a local path and fails, try the Unsplash fallback
                if (!target.src.startsWith('http')) {
                  console.warn(`Local image not found: ${target.src}. Using fallback.`);
                  // Extract just the filename from the path
                  const filename = target.src.split('/').pop() || '';
                  // Map of fallback URLs by image name pattern
                  const fallbacks: Record<string, string> = {
                    'word-games-vocabulary': 'https://images.unsplash.com/photo-1544982503-9f984c14501a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'children-brain-function': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'word-games-history': 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'vocabulary-building': 'https://images.unsplash.com/photo-1546521343-4eb2c9aa8de5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'digital-vs-traditional': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                  };
                  
                  // Find matching fallback or use a default
                  const fallbackKey = Object.keys(fallbacks).find(key => filename.includes(key));
                  target.src = fallbackKey 
                    ? fallbacks[fallbackKey] 
                    : 'https://images.unsplash.com/photo-1544982503-9f984c14501a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                }
              }}
            />
          </div>
          
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 flex-wrap">
              <div className="flex items-center">
                <span className="font-medium text-gray-700 mr-2">By {post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <div 
              className="prose prose-lg max-w-none mb-10 blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="border-t border-gray-200 pt-6 mt-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                    <Bookmark className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <a href="#" className="text-blue-700 hover:text-blue-900">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={relatedPost.imageUrl} 
                      alt={relatedPost.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      <Link to={`/blog/${relatedPost.slug}`} className="hover:text-blue-700 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{relatedPost.summary}</p>
                    <Link 
                      to={`/blog/${relatedPost.slug}`}
                      className="text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="font-medium text-blue-700">&copy; {new Date().getFullYear()} Word Making Games</p>
            <p className="mt-2 text-gray-600 text-sm">
              Improve your vocabulary with our educational word games and resources.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                to="/blog"
                className="text-blue-600 hover:text-blue-800 transition font-medium"
              >
                Blog
              </Link>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                About
              </Link>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                Privacy
              </Link>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default BlogPostPage; 