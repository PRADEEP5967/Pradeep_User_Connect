import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Users, TrendingUp, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/ps-logo.png" alt="PS Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Store Rating Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">About Our Platform</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering customers and store owners through transparent, reliable ratings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                To create a trusted ecosystem where customers can make informed decisions and store owners can improve their services based on genuine feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We believe in transparency, authenticity, and continuous improvement. Our platform connects customers with quality stores while helping businesses grow through constructive feedback.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Our Community</CardTitle>
              <CardDescription>
                A growing network of users, store owners, and administrators working together for excellence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join thousands of users who trust our platform for honest reviews and ratings. Whether you're a customer looking for the best stores or a business owner seeking growth, we're here for you.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Data-driven insights to help stores understand their performance and improve customer satisfaction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our platform provides comprehensive analytics, trend tracking, and actionable insights that help store owners make informed decisions and enhance their services.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Trust & Security</CardTitle>
              <CardDescription>
                Your data and privacy are our top priorities with industry-standard security measures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We implement robust security protocols to protect your information and ensure all ratings are authentic and verified.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Customers</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rate and review stores</li>
                  <li>• Search and filter stores</li>
                  <li>• Compare multiple stores</li>
                  <li>• View store locations on map</li>
                  <li>• Track your rating history</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Store Owners</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Manage store information</li>
                  <li>• View detailed analytics</li>
                  <li>• Track rating trends</li>
                  <li>• Respond to feedback</li>
                  <li>• Performance insights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Administrators</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• User management</li>
                  <li>• Store oversight</li>
                  <li>• Advanced analytics</li>
                  <li>• Bulk operations</li>
                  <li>• System monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;
