import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Database, Globe, Cpu, Blocks, Server, Rocket, Stars, Moon } from 'lucide-react';

function App() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsRef.current.appendChild(star);
    }

    // Create shooting stars
    for (let i = 0; i < 5; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.left = `${Math.random() * 100}%`;
      shootingStar.style.top = `${Math.random() * 100}%`;
      shootingStar.style.animationDelay = `${Math.random() * 5}s`;
      starsRef.current.appendChild(shootingStar);
    }
  }, []);

  const projects = [
    {
      title: "Stellar E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
      tags: ["React", "Node.js", "PostgreSQL", "Redux"],
      link: "#"
    },
    {
      title: "Nebula Chat Application",
      description: "WebSocket-based chat app with user authentication and file sharing",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1600",
      tags: ["WebSocket", "Express", "MongoDB", "JWT"],
      link: "#"
    },
    {
      title: "Cosmos Task Manager",
      description: "Collaborative project management tool with real-time updates",
      image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1600",
      tags: ["TypeScript", "React", "Node.js", "Socket.io"],
      link: "#"
    }
  ];

  const skills = [
    { icon: <Code2 className="w-8 h-8" />, name: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
    { icon: <Server className="w-8 h-8" />, name: "Backend", items: ["Node.js", "Express", "Python", "Django"] },
    { icon: <Database className="w-8 h-8" />, name: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "MySQL"] },
    { icon: <Globe className="w-8 h-8" />, name: "DevOps", items: ["Docker", "AWS", "CI/CD", "Kubernetes"] },
    { icon: <Cpu className="w-8 h-8" />, name: "Tools", items: ["Git", "VS Code", "Postman", "Linux"] },
    { icon: <Blocks className="w-8 h-8" />, name: "Other", items: ["REST APIs", "GraphQL", "WebSocket", "Testing"] }
  ];

  return (
    <div className="min-h-screen space-gradient text-white relative">
      <div ref={starsRef} className="fixed inset-0 overflow-hidden pointer-events-none" />
      <div className="aurora fixed inset-0 pointer-events-none" />

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 float-animation">
              <Rocket className="w-20 h-20 mx-auto text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
              Full-Stack Developer
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Launching innovative web solutions into the digital universe
            </p>
            <div className="flex justify-center gap-4">
              <a href="#" className="p-2 hover:text-purple-400 transition-colors transform hover:scale-110 duration-300">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="p-2 hover:text-blue-400 transition-colors transform hover:scale-110 duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="p-2 hover:text-emerald-400 transition-colors transform hover:scale-110 duration-300">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Skills Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-16">
            <Stars className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-center">Technical Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg glass-effect card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {skill.icon}
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                </div>
                <ul className="space-y-2">
                  {skill.items.map((item, idx) => (
                    <li key={idx} className="text-gray-300">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-16">
            <Moon className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl font-bold text-center">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg card-hover"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a 
                      href={project.link} 
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Project <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-xl text-gray-300 mb-8">
            Ready to explore new frontiers together? Let's discuss your project.
          </p>
          <a 
            href="mailto:your.email@example.com" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
          >
            Get in Touch <Mail className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;