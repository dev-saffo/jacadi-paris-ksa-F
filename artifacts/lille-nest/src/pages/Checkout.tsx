import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/context/CartContext';
import { CreditCard, Truck, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { CatalogImage } from '@/components/products/CatalogImage';
import { formatMoney } from '@/data/products';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const currency = items[0]?.product.currency ?? 'SAR';
  
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    saveInfo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully!', {
        description: 'You will receive a confirmation email shortly.',
      });
      navigate('/');
      setIsProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/20">
          <div className="container py-8">
            <div className="text-center py-8">
              <span className="text-6xl block mb-4">🛒</span>
              <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add items to your cart before checking out
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
        </div>

        <section className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-bold">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-card rounded p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-card rounded p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-card rounded p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold mb-6">Shipping Method</h2>
                  <RadioGroup
                    value={formData.shippingMethod}
                    onValueChange={(value) => setFormData({ ...formData, shippingMethod: value })}
                  >
                    <div className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <div className="font-semibold">Standard Shipping</div>
                          <div className="text-sm text-muted-foreground">5-7 business days</div>
                        </Label>
                      </div>
                      <span className="font-semibold">{shipping === 0 ? 'FREE' : `SAR ${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div className="font-semibold">Express Shipping</div>
                          <div className="text-sm text-muted-foreground">2-3 business days</div>
                        </Label>
                      </div>
                      <span className="font-semibold">SAR 45.00</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <Label htmlFor="overnight" className="cursor-pointer">
                          <div className="font-semibold">Overnight Shipping</div>
                          <div className="text-sm text-muted-foreground">Next business day</div>
                        </Label>
                      </div>
                      <span className="font-semibold">SAR 65.00</span>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold mb-6">Payment Method</h2>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-3 p-4 border rounded hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Credit / Debit Card
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          required
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          required
                          value={formData.cardName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date *</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            required
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvv">CVV *</Label>
                          <Input
                            id="cardCvv"
                            name="cardCvv"
                            required
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-6">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, saveInfo: checked as boolean })
                      }
                    />
                    <Label htmlFor="saveInfo" className="cursor-pointer text-sm">
                      Save this information for next time
                    </Label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded p-6 shadow-soft sticky top-24">
                  <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {items.map(({ product, quantity, selectedSize }) => (
                      <div
                        key={`${product.id}-${selectedSize ?? 'one-size'}`}
                        className="flex gap-3"
                      >
                        <CatalogImage
                          src={product.images[0]}
                          alt={product.title}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{product.title}</p>
                          <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                          {selectedSize && (
                            <p className="text-xs text-muted-foreground">Size: {selectedSize}</p>
                          )}
                          <p className="text-sm font-semibold">
                            {formatMoney(product.price * quantity, product.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pt-6 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatMoney(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : formatMoney(shipping, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatMoney(tax, currency)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-display font-bold text-lg">Total</span>
                      <span className="font-display font-bold text-lg">{formatMoney(total, currency)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
