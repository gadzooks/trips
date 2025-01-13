// app/privacy/page.tsx
import Image from 'next/image';

export default function PrivacyPolicy() {  // or Terms() for terms page
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
                MyTripPlanner Privacy Policy  {/* or Terms of Service */}
            </h1>
            <p className="text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        </div>

        <div className="prose prose-lg">
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#8B5CF6] mb-4">1. Information We Collect</h2>
                            <p className="text-gray-700">
                                When you use MyTripPlanner, we collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc pl-6 mt-2 text-gray-700">
                                <li>Account information (name, email, password)</li>
                                <li>Trip plans and itineraries</li>
                                <li>Location data for trip planning</li>
                                <li>User preferences and settings</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#8B5CF6] mb-4">2. How We Use Your Information</h2>
                            <p className="text-gray-700">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 mt-2 text-gray-700">
                                <li>Provide and improve our trip planning services</li>
                                <li>Personalize your experience</li>
                                <li>Send important updates about your trips</li>
                                <li>Ensure the security of your account</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div >
);
}

