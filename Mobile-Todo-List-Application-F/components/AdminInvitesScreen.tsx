import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalization } from './LocalizationProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Skeleton } from './ui/Skeleton';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  Plus, 
  Mail, 
  Send, 
  MoreHorizontal, 
  RefreshCw, 
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';
import { adminService, type Invite, type InviteStatus } from '../services/admin';

interface AdminInvitesScreenProps {
  onNavigate: (screen: string) => void;
}

// Simple chip input component for email addresses
function EmailChipInput({ 
  emails, 
  onEmailsChange, 
  placeholder 
}: { 
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail();
    } else if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      onEmailsChange(emails.slice(0, -1));
    }
  };

  const addEmail = () => {
    const email = inputValue.trim();
    if (email && isValidEmail(email) && !emails.includes(email)) {
      onEmailsChange([...emails, email]);
      setInputValue('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onEmailsChange(emails.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {emails.map((email, index) => (
          <motion.div
            key={email}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm"
          >
            <Mail className="w-3 h-3" />
            <span>{email}</span>
            <button
              onClick={() => removeEmail(email)}
              className="hover:bg-primary/20 rounded p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addEmail}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}

export function AdminInvitesScreen({ onNavigate }: AdminInvitesScreenProps) {
  const { t } = useLocalization();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Form state
  const [form, setForm] = useState({
    emails: [] as string[],
    role: 'member' as 'member' | 'admin',
    note: ''
  });

  // Load invites on component mount
  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getInvites();
      setInvites(data);
    } catch (err) {
      setError('Failed to load invites');
      console.error('Error loading invites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvites = async () => {
    if (form.emails.length === 0) {
      toast.error(t('admin.invites.form.email.required'));
      return;
    }

    try {
      setSending(true);
      const newInvites = await adminService.sendInvites({
        emails: form.emails,
        role: form.role,
        note: form.note || undefined
      });

      // Add new invites to the beginning of the list
      setInvites(prev => [...newInvites, ...prev]);
      
      // Reset form
      setForm({
        emails: [],
        role: 'member',
        note: ''
      });

      toast.success(
        t('admin.invites.sent.success', { count: newInvites.length })
      );
    } catch (err) {
      toast.error(t('admin.invites.sent.error'));
      console.error('Error sending invites:', err);
    } finally {
      setSending(false);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      const updatedInvite = await adminService.resendInvite(inviteId);
      setInvites(prev => prev.map(invite => 
        invite.id === inviteId ? updatedInvite : invite
      ));
      toast.success(t('admin.invites.resent.success'));
    } catch (err) {
      toast.error(t('admin.invites.resent.error'));
      console.error('Error resending invite:', err);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await adminService.revokeInvite(inviteId);
      setInvites(prev => prev.filter(invite => invite.id !== inviteId));
      toast.success(t('admin.invites.revoked.success'));
    } catch (err) {
      toast.error(t('admin.invites.revoked.error'));
      console.error('Error revoking invite:', err);
    }
  };

  const goBack = () => onNavigate('admin-dashboard');

  const getStatusIcon = (status: InviteStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-danger" />;
    }
  };

  const getStatusColor = (status: InviteStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'accepted':
        return 'bg-success/10 text-success border-success/20';
      case 'expired':
        return 'bg-danger/10 text-danger border-danger/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="h-9 w-9 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-medium">{t('admin.invites.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.invites.subtitle')}
          </p>
        </div>
        <Button
          onClick={loadInvites}
          variant="outline"
          size="sm"
          disabled={loading}
          className="h-9 w-9 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Create Invite Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            {t('admin.invites.create.title')}
          </h2>

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <Label htmlFor="emails">{t('admin.invites.form.email.label')}</Label>
              <EmailChipInput
                emails={form.emails}
                onEmailsChange={(emails) => setForm(prev => ({ ...prev, emails }))}
                placeholder={t('admin.invites.form.email.placeholder')}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('admin.invites.form.email.help')}
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <Label htmlFor="role">{t('admin.invites.form.role.label')}</Label>
              <Select value={form.role} onValueChange={(value: 'member' | 'admin') => setForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.invites.form.role.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">{t('admin.invites.form.role.member')}</SelectItem>
                  <SelectItem value="admin">{t('admin.invites.form.role.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Optional Note */}
            <div>
              <Label htmlFor="note">{t('admin.invites.form.note.label')}</Label>
              <Textarea
                id="note"
                value={form.note}
                onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder={t('admin.invites.form.note.placeholder')}
                rows={2}
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendInvites}
              disabled={form.emails.length === 0 || sending}
              className="w-full"
            >
              {sending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {t('admin.invites.send')}
            </Button>
          </div>
        </motion.div>

        {/* Invites Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t('admin.invites.table.title')}
              {!loading && <Badge variant="secondary">{invites.length}</Badge>}
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-danger mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadInvites} variant="outline">
                {t('common.retry')}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && invites.length === 0 && (
            <div className="p-8 text-center">
              <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">{t('admin.invites.empty.title')}</p>
              <p className="text-sm text-muted-foreground">{t('admin.invites.empty.description')}</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && invites.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.invites.table.email')}</TableHead>
                  <TableHead>{t('admin.invites.table.role')}</TableHead>
                  <TableHead>{t('admin.invites.table.status')}</TableHead>
                  <TableHead>{t('admin.invites.table.sentAt')}</TableHead>
                  <TableHead>{t('admin.invites.table.expiresAt')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {invites.map((invite, index) => (
                    <motion.tr
                      key={invite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{invite.email}</div>
                          {invite.note && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {invite.note}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`admin.invites.form.role.${invite.role}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invite.status)}>
                          {getStatusIcon(invite.status)}
                          <span className="ml-1">
                            {t(`admin.invites.status.${invite.status}`)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(invite.sentAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invite.expiresAt ? formatDate(invite.expiresAt) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {invite.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResendInvite(invite.id)}
                              className="h-8 px-2 text-xs"
                            >
                              {t('admin.invites.actions.resend')}
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t('admin.invites.revoke.confirm.title')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin.invites.revoke.confirm.description', { email: invite.email })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRevokeInvite(invite.id)}
                                  className="bg-danger text-danger-foreground hover:bg-danger/90"
                                >
                                  {t('admin.invites.actions.revoke')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </div>
  );
}