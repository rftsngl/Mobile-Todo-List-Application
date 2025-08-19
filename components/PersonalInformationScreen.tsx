import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Edit3
} from 'lucide-react';

interface PersonalInformationScreenProps {
  onNavigate: (screen: string) => void;
}

export function PersonalInformationScreen({ onNavigate }: PersonalInformationScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about productivity and getting things done efficiently. Love exploring new tools and methodologies.',
    location: 'San Francisco, CA',
    dateOfBirth: '1990-05-15',
    jobTitle: 'Product Designer',
    company: 'TaskFlow Inc.'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values if needed
    setIsEditing(false);
  };

  const profileSections = [
    {
      title: 'Basic Information',
      fields: [
        {
          label: 'First Name',
          key: 'firstName',
          type: 'text',
          icon: User,
          required: true
        },
        {
          label: 'Last Name', 
          key: 'lastName',
          type: 'text',
          icon: User,
          required: true
        },
        {
          label: 'Email',
          key: 'email',
          type: 'email',
          icon: Mail,
          required: true
        },
        {
          label: 'Phone Number',
          key: 'phone',
          type: 'tel',
          icon: Phone,
          required: false
        }
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        {
          label: 'Job Title',
          key: 'jobTitle',
          type: 'text',
          icon: User,
          required: false
        },
        {
          label: 'Company',
          key: 'company',
          type: 'text',
          icon: User,
          required: false
        },
        {
          label: 'Location',
          key: 'location',
          type: 'text',
          icon: MapPin,
          required: false
        },
        {
          label: 'Date of Birth',
          key: 'dateOfBirth',
          type: 'date',
          icon: Calendar,
          required: false
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">Personal Information</h1>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Picture Section */}
        <div className="bg-gradient-to-b from-primary/5 to-background p-6">
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarFallback className="text-2xl">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <h2 className="text-xl mt-4 mb-1">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-muted-foreground">
              {formData.jobTitle} {formData.company && `at ${formData.company}`}
            </p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="px-6 pb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <Label className="text-sm text-muted-foreground">Bio</Label>
            
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-2 min-h-[80px] resize-none bg-input-background"
              />
            ) : (
              <p className="mt-2 text-sm leading-relaxed">
                {formData.bio || 'No bio added yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Form Sections */}
        <div className="px-6 space-y-6">
          {profileSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm text-muted-foreground mb-4">{section.title}</h3>
              <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                {section.fields.map((field, fieldIndex) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={fieldIndex} className="space-y-2">
                      <Label htmlFor={field.key} className="text-sm">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                        </div>
                        
                        <Input
                          id={field.key}
                          type={field.type}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          disabled={!isEditing}
                          className={`pl-10 h-12 bg-input-background ${
                            !isEditing ? 'cursor-default' : ''
                          }`}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="p-6 space-y-3">
            <Button 
              onClick={handleSave}
              className="w-full h-12 rounded-xl"
            >
              Save Changes
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="w-full h-12 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Account Actions */}
        <div className="p-6 pb-8">
          <h3 className="text-sm text-muted-foreground mb-4">Account Actions</h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 rounded-none border-b border-border"
            >
              <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
              Change Email Address
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-12 rounded-none border-b border-border"
            >
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Change Password
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-12 rounded-none text-destructive hover:text-destructive"
            >
              <User className="w-4 h-4 mr-3" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}