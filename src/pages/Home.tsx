import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, hasAdminPermissions } from '@/contexts/AuthContext';
import {
  Package,
  ShoppingBag,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Shield,
  Truck,
  Award,
  ArrowRight,
  CheckCircle,
  Globe,
} from 'lucide-react';

const Home: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlMGU3ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 50+ Schools
            </Badge>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text-primary">SS Uniforms</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Delhi NCR's premier school uniform provider. Quality uniforms, 
            competitive prices, and exceptional service for educational institutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/catalogues">
              <Button size="xl" variant="business" className="w-full sm:w-auto">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Catalogues
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            {user && hasAdminPermissions(profile) && (
              <Link to="/admin">
                <Button size="xl" variant="purple" className="w-full sm:w-auto">
                  <Package className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            
            {!user && (
              <Link to="/login">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Staff Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text-blue mb-4">
              Why Choose SS Uniforms?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide complete uniform solutions with unmatched quality and service standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-blue hover:shadow-business-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">Premium Quality</h3>
                <p className="text-blue-600">
                  High-grade fabrics and superior stitching for long-lasting uniforms
                </p>
              </CardContent>
            </Card>

            <Card className="card-green hover:shadow-business-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-3">50+ Schools</h3>
                <p className="text-green-600">
                  Trusted partner for schools across Delhi NCR region
                </p>
              </CardContent>
            </Card>

            <Card className="card-purple hover:shadow-business-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3">Best Prices</h3>
                <p className="text-purple-600">
                  Competitive pricing without compromising on quality
                </p>
              </CardContent>
            </Card>

            <Card className="card-orange hover:shadow-business-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-800 mb-3">Expert Support</h3>
                <p className="text-orange-600">
                  Dedicated customer service and uniform consultation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text-primary mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete uniform solutions tailored to your school's requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-business bg-gradient-to-br from-white to-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800 flex items-center gap-3">
                  <Package className="w-6 h-6" />
                  School Uniforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Summer Collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Winter Collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">House Uniforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Sports Wear</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Complete range of school uniforms including shirts, pants, skirts, blazers, and accessories.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-business bg-gradient-to-br from-white to-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
                  <Truck className="w-6 h-6" />
                  Additional Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Custom Embroidery & Printing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Bulk Orders & Discounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Quick Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Size Exchange Policy</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Personalized services including logo embroidery, bulk processing, and flexible exchange policies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-muted/50 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text-primary mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visit our store or contact us for uniform requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visit Our Store</h3>
                <p className="text-muted-foreground mb-4">
                  SS Uniforms<br />
                  Main Market, Delhi NCR<br />
                  Near Metro Station
                </p>
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Call Us</h3>
                <p className="text-muted-foreground mb-4">
                  +91 98765 43210<br />
                  +91 87654 32109<br />
                  Mon - Sat: 9 AM - 8 PM
                </p>
                <Button variant="outline" size="sm">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  info@ssuniforms.com<br />
                  orders@ssuniforms.com<br />
                  Quick response guaranteed
                </p>
                <Button variant="outline" size="sm">
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our extensive catalogue of school uniforms or contact us for custom requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogues">
              <Button size="xl" variant="glass" className="w-full sm:w-auto">
                <Package className="w-5 h-5 mr-2" />
                View Catalogues
              </Button>
            </Link>
            <Button size="xl" variant="outline" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;