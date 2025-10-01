import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Terms = () => {
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
          <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h2>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              By accessing or using the Store Rating Platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Registration</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be at least 13 years old to use this Platform</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Account Security</h4>
              <p>
                You must immediately notify us of any unauthorized use of your account or any other security breach. We will not be liable for any loss arising from unauthorized use of your account.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Content and Conduct</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Rating Guidelines</h4>
              <p className="mb-2">When submitting ratings and reviews, you agree to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide honest and accurate feedback based on your experience</li>
                <li>Not submit fake, fraudulent, or manipulated ratings</li>
                <li>Not use offensive, abusive, or inappropriate language</li>
                <li>Not violate any applicable laws or regulations</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Prohibited Activities</h4>
              <p className="mb-2">You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with or disrupt the Platform's functionality</li>
                <li>Use the Platform for any illegal purposes</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate another person or entity</li>
                <li>Collect or store personal data of other users</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Store Owner Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">If you are a store owner, you additionally agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide accurate store information</li>
              <li>Keep your store details up to date</li>
              <li>Not manipulate ratings or reviews</li>
              <li>Accept customer feedback professionally</li>
              <li>Use customer data responsibly and in compliance with privacy laws</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">
              The Platform and its original content, features, and functionality are owned by Store Rating Platform and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You retain ownership of content you submit, but you grant us a worldwide, non-exclusive license to use, display, and distribute your content on the Platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Disclaimer of Warranties</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Platform will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of ratings and reviews</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE PLATFORM.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">
              We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Breach of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>At your request</li>
              <li>For any other reason at our sole discretion</li>
            </ul>
            <p className="mt-3">
              Upon termination, your right to use the Platform will immediately cease.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by updating the date at the top of these Terms and, where appropriate, provide additional notice. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <Button onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Terms;
