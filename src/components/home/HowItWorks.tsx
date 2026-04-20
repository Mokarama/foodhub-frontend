export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      emoji: '🔍',
      title: 'Browse Meals',
      description: 'Explore a variety of delicious meals from local providers',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
    {
      number: '02',
      emoji: '🛒',
      title: 'Add to Cart',
      description: 'Choose your favorite meals and customize your order',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      number: '03',
      emoji: '📦',
      title: 'Place Order',
      description: 'Secure checkout with easy delivery address entry',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      number: '04',
      emoji: '🎉',
      title: 'Enjoy & Review',
      description: 'Receive your food and share your experience with a review',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            How FoodHub Works
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Getting your favorite food is easier than ever — just 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group text-center animate-fadeInUp"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
            >
              {/* Connector Line (between cards on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 z-0" />
              )}

              {/* Card */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={`w-24 h-24 rounded-3xl ${step.bgColor}
                  flex items-center justify-center text-4xl mb-5
                  group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                >
                  {step.emoji}
                </div>

                {/* Step Number */}
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-widest mb-2
                  bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
                >
                  Step {step.number}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
