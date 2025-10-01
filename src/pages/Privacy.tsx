import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Privacy = () => {
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
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h2>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground">
              Welcome to Store Rating Platform ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
              <p>We collect personal information that you provide to us, including:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Name and email address</li>
                <li>Account credentials (password is securely hashed)</li>
                <li>Physical address</li>
                <li>Store information (for store owners)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Usage Data</h4>
              <p>We automatically collect certain information when you use our platform:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Ratings and reviews you submit</li>
                <li>Interaction with stores and features</li>
                <li>Device and browser information</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Process and display your ratings and reviews</li>
              <li>Send you notifications and updates</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Secure data storage using browser localStorage</li>
              <li>Password hashing and encryption</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access and review your personal information</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain data collection</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us through our support channels.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We use browser localStorage to store your authentication state and preferences. This technology is essential for the platform to function properly. No third-party tracking cookies are used.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">We do not sell your personal information. We may share your information only in these circumstances:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us:
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

export default Privacy;
