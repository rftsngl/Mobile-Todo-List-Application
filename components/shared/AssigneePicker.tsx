import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { RoleBadge } from './RoleBadge';
import { 
  Search, 
  ChevronDown, 
  X, 
  Check,
  User,
  Users
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  isOnline?: boolean;
  lastActive?: string;
}

interface AssigneePickerProps {
  members: TeamMember[];
  selectedMembers: string[];
  onSelectionChange: (memberIds: string[]) => void;
  multiSelect?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxSelections?: number;
}

export function AssigneePicker({
  members,
  selectedMembers,
  onSelectionChange,
  multiSelect = false,
  placeholder = "Select assignee...",
  className = "",
  disabled = false,
  maxSelections
}: AssigneePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter members based on search query
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected member objects
  const selectedMemberObjects = members.filter(member => 
    selectedMembers.includes(member.id)
  );

  // Handle member selection
  const handleMemberSelect = (memberId: string) => {
    if (disabled) return;

    let newSelection: string[];
    
    if (multiSelect) {
      if (selectedMembers.includes(memberId)) {
        // Remove if already selected
        newSelection = selectedMembers.filter(id => id !== memberId);
      } else {
        // Add if not selected (respect maxSelections)
        if (maxSelections && selectedMembers.length >= maxSelections) {
          return; // Don't add if at max
        }
        newSelection = [...selectedMembers, memberId];
      }
    } else {
      // Single select - replace selection or clear if same
      newSelection = selectedMembers.includes(memberId) ? [] : [memberId];
      setIsOpen(false); // Close dropdown for single select
    }

    onSelectionChange(newSelection);
    setSearchQuery('');
    setFocusedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredMembers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredMembers.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredMembers.length) {
          handleMemberSelect(filteredMembers[focusedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between p-3 rounded-xl border border-border 
            bg-card hover:bg-card/80 transition-all duration-200 text-left
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-primary/20 border-primary/30' : ''}
          `}
        >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {selectedMemberObjects.length > 0 ? (
              <div className="flex items-center space-x-2">
                {/* Avatar Stack for Multiple Selections */}
                {multiSelect && selectedMemberObjects.length > 1 ? (
                  <div className="flex -space-x-2">
                    {selectedMemberObjects.slice(0, 3).map((member, index) => (
                      <Avatar key={member.id} className="w-6 h-6 border border-background">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {selectedMemberObjects.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{selectedMemberObjects.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single Selection Display */
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(selectedMemberObjects[0].name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">
                    {selectedMemberObjects.length === 1 
                      ? selectedMemberObjects[0].name
                      : `${selectedMemberObjects.length} selected`
                    }
                  </p>
                  {selectedMemberObjects.length === 1 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedMemberObjects[0].email}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{placeholder}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {selectedMemberObjects.length > 0 && !disabled && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectionChange([]);
                }}
                className="w-4 h-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-2.5 h-2.5 text-muted-foreground" />
              </motion.button>
            )}
            
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </div>
        </button>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team members..."
                  className="pl-9 h-8 bg-background/50"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            {/* Members List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredMembers.length > 0 ? (
                <div className="p-1">
                  {filteredMembers.map((member, index) => {
                    const isSelected = selectedMembers.includes(member.id);
                    const isFocused = index === focusedIndex;

                    return (
                      <motion.button
                        key={member.id}
                        onClick={() => handleMemberSelect(member.id)}
                        className={`
                          w-full flex items-center justify-between p-2 rounded-lg transition-all duration-150 text-left
                          ${isFocused ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-muted/50'}
                          ${isSelected ? 'bg-primary/10 text-primary' : ''}
                        `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Online Status */}
                            {member.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-0.5">
                              <p className="text-sm truncate">{member.name}</p>
                              <RoleBadge role={member.role} size="sm" />
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.email}
                            </p>
                            {!member.isOnline && member.lastActive && (
                              <p className="text-xs text-muted-foreground">
                                Last active {member.lastActive}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-4 h-4 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No members found' : 'No team members available'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Info */}
            {multiSelect && maxSelections && (
              <div className="p-2 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  {selectedMembers.length} / {maxSelections} selected
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export types for use in other components
export type { TeamMember };