import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, Mail } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Help = () => {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-4">Help Center</h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions and get support
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create an account?</AccordionTrigger>
                <AccordionContent>
                  Click the "Register" button on the login page, fill in your details including name, email, password, and address, then submit the form. You'll be automatically logged in after successful registration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do I rate a store?</AccordionTrigger>
                <AccordionContent>
                  Once logged in as a user, go to your dashboard, find the store you want to rate, and click the star rating component. Select your rating from 1-5 stars and submit. You can also update your rating later.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I change my rating after submitting?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can update your rating at any time. Simply go to the store you've rated and submit a new rating. The system will update your previous rating.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do I register my store?</AccordionTrigger>
                <AccordionContent>
                  Contact an administrator to register your store. Once registered, you'll receive store owner credentials to manage your store information and view analytics.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What is the difference between user roles?</AccordionTrigger>
                <AccordionContent>
                  <strong>Users</strong> can rate and review stores. <strong>Store Owners</strong> can manage their store information and view performance analytics. <strong>Administrators</strong> have full access to manage users, stores, and view system-wide analytics.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How is the average rating calculated?</AccordionTrigger>
                <AccordionContent>
                  The average rating is calculated by summing all ratings for a store and dividing by the total number of ratings. The rating is displayed with one decimal place precision.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Can I delete my account?</AccordionTrigger>
                <AccordionContent>
                  Please contact an administrator to request account deletion. Note that deleting your account will remove all your ratings and associated data.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                <AccordionContent>
                  You can change your password from your dashboard settings. Navigate to your profile settings and use the "Change Password" option. Your new password must be at least 8 characters long.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger>What browsers are supported?</AccordionTrigger>
                <AccordionContent>
                  The platform is optimized for modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, please use the latest version of your preferred browser.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take security seriously. All data is stored securely using industry-standard practices. Your passwords are hashed, and we implement various security measures to protect your information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Live Chat Support</CardTitle>
              <CardDescription>Get instant help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/contact')}>
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Send us a detailed message</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Help;
