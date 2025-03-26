'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'

// About Section Component
const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 backdrop-blur-sm bg-white/10 p-8 rounded-xl">
          <h2 className="text-4xl font-bold mb-4 text-white">About Crescent</h2>
          <p className="text-lg text-white/90">
            Crescent is an innovative educational platform designed to transform how students learn and teachers teach. 
            Our mission is to make high-quality education accessible, engaging, and effective for everyone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="backdrop-blur-sm bg-white/10 p-8 rounded-xl">
            <h3 className="text-2xl font-semibold mb-4 text-white">Our Story</h3>
            <p className="text-white/90 mb-4">
              Founded by a team of educators and technologists, Crescent was born from a simple observation: 
              traditional educational tools weren't keeping pace with how today's students learn.
            </p>
            <p className="text-white/90 mb-4">
              We set out to create a platform that combines cutting-edge technology with proven educational 
              methodologies to deliver a learning experience that's both effective and engaging.
            </p>
            <p className="text-white/90">
              We are a new platform, but one that has developed innovative statistical approaches 
              to help educators measure and improve learning outcomes.
            </p>
          </div>
          <div className="backdrop-blur-sm bg-white/10 p-4 rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
              alt="Students learning with Crescent" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        
        <div className="mt-20">
          <h3 className="text-2xl font-semibold mb-8 text-center text-white">Why Choose Crescent</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl hover:bg-white/20 transition duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">Personalized Learning</h4>
              <p className="text-white/90">
                Our adaptive learning system tailors content to each student's unique needs, ensuring they learn at their own pace and in their own style.
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl hover:bg-white/20 transition duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">Data-Driven Insights</h4>
              <p className="text-white/90">
                Our platform provides actionable analytics that help teachers identify strengths and areas for improvement, allowing for targeted instruction.
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl hover:bg-white/20 transition duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">Comprehensive Curriculum</h4>
              <p className="text-white/90">
                Our content is aligned with national standards and covers all core subjects, ensuring a well-rounded education for all students.
              </p>
            </div>
          </div>
          
          <div className="mt-12 backdrop-blur-sm bg-white/10 p-8 rounded-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">Predictive Analytics & Student Insights</h3>
            <p className="text-white/90 mb-8 text-center max-w-3xl mx-auto">
              Crescent goes beyond basic progress tracking to provide meaningful, actionable insights about your students' academic trajectory.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-6 rounded-xl hover:bg-white/10 transition duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">College Readiness Score</h4>
                <p className="text-white/90 text-center">
                  Our algorithm calculates a precise college readiness percentage based on student performance across key academic areas.
                </p>
              </div>
              
              <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-6 rounded-xl hover:bg-white/10 transition duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">Regents Exam Prediction</h4>
                <p className="text-white/90 text-center">
                  Based on current performance, our system forecasts likely Regents exam scores, helping teachers focus on areas needing improvement.
                </p>
              </div>
              
              <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-6 rounded-xl hover:bg-white/10 transition duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">SAT Score Projection</h4>
                <p className="text-white/90 text-center">
                  Our predictive model estimates potential SAT scores, giving students and teachers time to address weaknesses before the actual test.
                </p>
              </div>
              
              <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-6 rounded-xl hover:bg-white/10 transition duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">Learning Pace Analysis</h4>
                <p className="text-white/90 text-center">
                  Track how quickly students master concepts compared to grade-level expectations, allowing for appropriate acceleration or intervention.
                </p>
              </div>
              
              <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-6 rounded-xl hover:bg-white/10 transition duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">Knowledge Gap Detection</h4>
                <p className="text-white/90 text-center">
                  Our system identifies specific knowledge gaps that may be hindering student progress, enabling targeted remediation.
                </p>
              </div>
              
              <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-6 rounded-xl hover:bg-white/10 transition duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">Mind Mapping</h4>
                <p className="text-white/90 text-center">
                  Visualize each student's progress through the curriculum with detailed cognitive maps that show strengths and areas needing attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// Pricing Card Component
const PricingCard = ({ title, price, period, features, highlighted, buttonText }) => {
  return (
    <div className={`rounded-lg p-8 shadow-lg ${highlighted ? 'bg-primary-50 border-2 border-primary-500' : 'bg-white'}`}>
      <h3 className={`text-2xl font-bold mb-2 ${highlighted ? 'text-primary-900' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${highlighted ? 'text-primary-900' : 'text-gray-900 dark:text-white'}`}>${price}</span>
        <span className={`${highlighted ? 'text-primary-700' : 'text-gray-600 dark:text-gray-300'}`}>/{period}</span>
      </div>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className={`w-5 h-5 ${highlighted ? 'text-primary-600' : 'text-green-600'} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className={`${highlighted ? 'text-primary-800' : 'text-gray-700 dark:text-gray-200'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 px-4 rounded-lg font-medium ${highlighted ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
        {buttonText || "Get Started"}
      </button>
    </div>
  );
};

// Pricing Section Component
const Pricing = () => {
  const individualPlans = [
    {
      title: "Apprentice",
      price: "9.99",
      period: "student/month",
      features: [
        "Access to core learning modules",
        "Basic progress tracking",
        "Mobile app access",
        "Email support"
      ],
      highlighted: false
    },
    {
      title: "Sage",
      price: "19.99",
      period: "student/month",
      features: [
        "All Starter features",
        "Advanced analytics dashboard",
        "Personalized learning paths",
        "Priority support",
        "Custom content integration"
      ],
      highlighted: true
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary-600 dark:text-primary-300">Flexible Pricing Options</h2>
        <p className="text-center text-primary-600 dark:text-primary-300 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include our core features and regular updates.
        </p>
        
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-center mb-4 text-primary-600 dark:text-primary-300">Per-Student Plans</h3>
          <p className="text-center text-primary-600 dark:text-primary-300 mb-8 max-w-2xl mx-auto">
            Perfect for individual teachers, tutors, and small groups. Pay only for the students you have.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {individualPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-10 max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold text-center mb-4 text-black dark:text-white">For Schools & Districts</h3>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We offer custom pricing for educational institutions based on your specific needs and student count.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Schools</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Tailored to your school size</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Teacher dashboards</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Classroom management tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Detailed progress reports</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                Request School Pricing
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Districts</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">District-wide analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Admin control panel</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">API integration</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Dedicated account manager</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                Request District Pricing
              </button>
            </div>
          </div>
          
          <p className="text-center mt-8 text-gray-700 dark:text-gray-300">
            Contact our education specialists to discuss your specific needs and get a custom quote.
          </p>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-primary-900 dark:text-primary-100">All plans include:</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h4 className="text-lg font-medium mb-2 text-primary-900 dark:text-primary-100">No setup fees</h4>
              <p className="text-center text-primary-700 dark:text-primary-300">Get started immediately with no upfront costs</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h4 className="text-lg font-medium mb-2 text-primary-900 dark:text-primary-100">Monthly billing</h4>
              <p className="text-center text-primary-700 dark:text-primary-300">Simple monthly billing with no long-term contracts</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <h4 className="text-lg font-medium mb-2 text-primary-900 dark:text-primary-100">Regular updates</h4>
              <p className="text-center text-primary-700 dark:text-primary-300">Continuous improvements and new features at no extra cost</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen landing-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl md:text-6xl">
            <span className="block">Crescent</span>
            <span className="block text-primary">Your Personal Knowledge Garden</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Organize your thoughts, build connections, and create a personalized knowledge base that grows with you.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-opacity-90 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <button
                onClick={() => router.push('/courses')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary-foreground hover:bg-opacity-90 md:py-4 md:text-lg md:px-10"
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              <span className="block">Why Choose Crescent?</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover how Crescent can transform the way you organize and connect your knowledge.
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            <div className="glassmorphism overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <dt className="text-lg font-medium text-foreground">
                  Interactive Courses
                </dt>
                <dd className="mt-2 text-base text-muted-foreground">
                  Access our comprehensive course library with interactive learning materials.
                </dd>
              </div>
            </div>

            <div className="glassmorphism overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <dt className="text-lg font-medium text-foreground">
                  Personal Notes
                </dt>
                <dd className="mt-2 text-base text-muted-foreground">
                  Create and organize your own notes to enhance your learning experience.
                </dd>
              </div>
            </div>

            <div className="glassmorphism overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <dt className="text-lg font-medium text-foreground">
                  Progress Tracking
                </dt>
                <dd className="mt-2 text-base text-muted-foreground">
                  Monitor your progress and achievements in real-time.
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Added About Section */}
      <About />
      
      {/* Added Pricing Section */}
      <Pricing />
    </div>
  )
}