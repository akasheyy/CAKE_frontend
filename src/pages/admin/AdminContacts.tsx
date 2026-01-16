import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, User, MessageSquare, Eye, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getContacts, markContactAsRead } from "@/api/cakeApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Phone as PhoneIcon, Mail as MailIcon, Cake, MessageSquare as MessageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* 🔐 Admin Guard */
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  /* 📞 Fetch Contacts */
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error("Failed to load contacts", error);
        toast({
          title: "Error",
          description: "Failed to load contacts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const handleMarkAsRead = async (contactId: string) => {
    try {
      await markContactAsRead(contactId);
      setContacts(contacts.map(contact =>
        contact._id === contactId ? { ...contact, read: true } : contact
      ));
      toast({
        title: "Marked as Read",
        description: "Contact message marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark contact as read",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppRedirect = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg font-medium animate-pulse text-slate-500">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contact Messages</h1>
            <p className="text-slate-500 mt-1">Manage and review customer contact submissions ({contacts.length})</p>
          </div>
          <Badge variant="outline" className="w-fit bg-white px-4 py-1 text-sm shadow-sm">
            Status: Active
          </Badge>
        </div>

        {contacts.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-slate-400">No contact messages found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <Card key={contact._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-white border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">{contact.name}</CardTitle>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MailIcon className="w-4 h-4" /> {contact.email}</span>
                        <span className="flex items-center gap-1"><PhoneIcon className="w-4 h-4" /> {contact.phone}</span>
                      </div>
                    </div>
                    {!contact.read && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">New</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 bg-white">
                  <div className="space-y-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold">{contact.subject}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <MessageSquare className="w-3 h-3" /> Message
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded">
                        {contact.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <p className="text-[11px] text-slate-400 uppercase font-medium">
                      Received {new Date(contact.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppRedirect(contact.phone)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                      {!contact.read && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsRead(contact._id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs uppercase text-slate-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
