import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { MapPin, Calendar, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

type User = {
  full_name?: string;
  email: string;
  avatar_url?: string;
};

const Profile = () => {
  const { user, loading } = useAuth() as { user: User | null, loading: boolean };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto"></div> {/* Changed from border-blue-600 */}
          <p className="mt-4 text-[#2563eb]">Loading your profile...</p> {/* Changed from text-blue-600 */}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">Please sign in to view your profile.</p>
              <Link to="/">
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]"> {/* Changed from bg-blue-500 hover:bg-blue-600 */}
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#2563eb] h-32 md:h-48 relative"> {/* Changed from bg-blue-500 */}
              <div className="absolute -bottom-16 left-8 bg-white p-2 rounded-full border-4 border-white">
                <Avatar className="h-28 w-28">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                  <AvatarFallback className="text-2xl">{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <div className="pt-20 px-8 pb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {user.full_name || 'Traveler'}
              </h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
              
              <Separator className="my-6" />
              
              <Tabs defaultValue="trips" className="w-full">
                <TabsList className="grid w-full md:w-80 grid-cols-2">
                  <TabsTrigger value="trips">
                    <Plane className="mr-2 h-4 w-4" />
                    Your Trips
                  </TabsTrigger>
                  <TabsTrigger value="account">
                    <MapPin className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="trips" className="mt-6">
                  <div className="text-center p-8 border rounded-lg bg-gray-50">
                    <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Explore Your Travel History
                    </h3>
                    <p className="text-gray-500 mb-4">
                      View and manage all your saved trip itineraries.
                    </p>
                    <Link to="/saved-trips">
                      <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]"> {/* Changed from bg-blue-500 hover:bg-blue-600 */}
                        View Saved Trips
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
                
                <TabsContent value="account" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Name</h3>
                          <p className="text-gray-800">{user.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="text-gray-800">{user.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                        <p className="text-gray-800">
                          <Calendar className="inline-block mr-2 h-4 w-4" />
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
