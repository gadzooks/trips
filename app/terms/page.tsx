import Image from 'next/image';

export default function Terms() {  // or Terms() for terms page
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-8 mb-8">
          <Image
            src="/images/logo.png"
            alt="MyTripPlanner Logo"
            width={150}
            height={150}
            priority
            />
            <div className="pt-4">
                <h1 className="text-4xl font-bold text-[#8B5CF6] mb-4">
                    MyTripPlanner Terms of Service
                </h1>
                <p className="text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>

        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="prose prose-lg">
                    <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#8B5CF6] mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700">
                        By accessing and using MyTripPlanner, you agree to be bound by these Terms of Service 
                        and our Privacy Policy. If you disagree with any part of the terms, you may not 
                        access the service.
                    </p>
                    </section>
        
                    <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#8B5CF6] mb-4">2. User Accounts</h2>
                    <p className="text-gray-700">
                        When you create an account with us, you must provide accurate and complete information. 
                        You are responsible for maintaining the security of your account and password.
                    </p>
                    </section>
        
                    <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#8B5CF6] mb-4">3. Service Usage</h2>
                    <p className="text-gray-700">
                        MyTripPlanner provides trip planning and itinerary management services. Users agree to:
                    </p>
                    <ul className="list-disc pl-6 mt-2 text-gray-700">
                        <li>Use the service for personal and non-commercial purposes</li>
                        <li>Not misuse or attempt to harm the service</li>
                        <li>Respect other users' privacy and rights</li>
                    </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
    </div >
);
}