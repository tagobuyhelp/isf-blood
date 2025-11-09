import Link from 'next/link';
import { Users, Heart, Truck, Building, Search, MapPin } from 'lucide-react';

export default function QuickActions() {
    const actions = [
        {
            id: 'find-donors',
            title: 'Find Donors',
            icon: Users,
            href: '/donors',
            color: 'bg-red-50 text-red-600',
            description: 'Search for blood donors near you'
        },
        {
            id: 'request-blood',
            title: 'Request Blood',
            icon: Heart,
            href: '/request',
            color: 'bg-pink-50 text-pink-600',
            description: 'Submit urgent blood request'
        },
        {
            id: 'blood-orders',
            title: 'Blood Orders',
            icon: Building,
            href: '/orders',
            color: 'bg-blue-50 text-blue-600',
            description: 'Track your blood orders'
        },
        {
            id: 'ambulances',
            title: 'Ambulances',
            icon: Truck,
            href: '/ambulances',
            color: 'bg-green-50 text-green-600',
            description: 'Emergency ambulance services'
        }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Nearby"
                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-isf-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors duration-200">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {actions.map((action) => {
                        const IconComponent = action.icon;
                        return (
                            <Link
                                key={action.id}
                                href={action.href}
                                className="group bg-white rounded-isf-lg shadow-isf hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-primary/20 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary transition-colors duration-200">
                                            {action.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}