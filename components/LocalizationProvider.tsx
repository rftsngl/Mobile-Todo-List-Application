import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Comprehensive translations with task menu actions and notification support
const translations = {
  tr: {
    // Common
    common: {
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      edit: 'Düzenle',
      add: 'Ekle',
      remove: 'Kaldır',
      close: 'Kapat',
      back: 'Geri',
      next: 'İleri',
      previous: 'Önceki',
      confirm: 'Onayla',
      retry: 'Tekrar Dene',
      loading: 'Yükleniyor...',
      saved: 'Kaydedildi',
      all: 'Tümü',
      select: 'Seç',
      clear: 'Temizle',
      clearFilters: 'Filtreleri Temizle',
      refresh: 'Yenile',
      today: 'Bugün',
      tomorrow: 'Yarın',
      optional: '(isteğe bağlı)',
      error: {
        general: 'Bir hata oluştu',
        network: 'Ağ hatası',
        clipboardFailed: 'Panoya kopyalanamadı'
      },
      priority: {
        low: 'Düşük',
        medium: 'Orta',
        high: 'Yüksek'
      }
    },

    // Time
    time: {
      now: 'Şimdi',
      minutesAgo: '{minutes} dakika önce',
      hoursAgo: '{hours} saat önce',
      daysAgo: '{days} gün önce'
    },

    // Navigation
    nav: {
      home: 'Ana Sayfa',
      board: 'Pano',
      profile: 'Profil',
      settings: 'Ayarlar',
      admin: 'Yönetici'
    },

    // Task Menu Actions
    task: {
      menu: {
        moreActions: 'Daha fazla eylem',
        view: 'Görüntüle',
        edit: 'Düzenle',
        markComplete: 'Tamamlandı olarak işaretle',
        markIncomplete: 'Tamamlanmadı olarak işaretle',
        archive: 'Arşivle',
        delete: 'Sil',
        share: 'Paylaş',
        linkCopied: 'Bağlantı panoya kopyalandı',
        markedComplete: 'Görev tamamlandı olarak işaretlendi',
        markedIncomplete: 'Görev tamamlanmadı olarak işaretlendi',
        archived: 'Görev arşivlendi',
        deleted: 'Görev silindi',
        deleteConfirm: {
          title: 'Görevi Sil',
          description: '"{taskTitle}" görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
        },
        archiveConfirm: {
          title: 'Görevi Arşivle',
          description: '"{taskTitle}" görevini arşivlemek istediğinizden emin misiniz?'
        }
      }
    },

    // Notifications
    notifications: {
      title: 'Bildirimler',
      markAllRead: 'Tümünü Okundu İşaretle',
      seeAll: 'Tümünü Gör',
      clearAll: 'Tümünü Temizle',
      unreadOnly: 'Sadece Okunmayanlar',
      unreadCount: '{count} okunmamış',
      allCaughtUp: 'Hepsi okundu!',
      empty: 'Bildirim bulunamadı',
      emptyDescription: 'Yeni bildirimler burada görünecek.',
      noResults: 'Sonuç bulunamadı',
      noResultsWithFilters: 'Bu filtrelerle eşleşen bildirim bulunamadı.',
      error: 'Bildirimler yüklenemedi',
      retry: 'Tekrar Dene',
      refresh: 'Yenile',
      refreshed: 'Bildirimler yenilendi',
      deleted: 'Bildirim silindi',
      deletedSelected: '{count} bildirim silindi',
      clearedAll: 'Tüm bildirimler temizlendi',
      markedAllRead: 'Tüm bildirimler okundu olarak işaretlendi',
      filter: {
        type: 'Türe Göre Filtrele',
        priority: 'Önceliğe Göre Filtrele'
      },
      type: {
        task: 'Görev',
        deadline: 'Son Tarih',
        reminder: 'Hatırlatma',
        collaboration: 'İşbirliği',
        system: 'Sistem',
        completion: 'Tamamlama'
      }
    },

    // Authentication
    auth: {
      signIn: 'Giriş Yap',
      signUp: 'Kayıt Ol',
      signOut: 'Çıkış Yap',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Onayla',
      name: 'Ad Soyad',
      forgotPassword: 'Şifremi Unuttum',
      createAccount: 'Hesap Oluştur',
      alreadyHaveAccount: 'Zaten hesabınız var mı?',
      dontHaveAccount: 'Hesabınız yok mu?',
      continueWithGoogle: 'Google ile devam et',
      continueWithApple: 'Apple ile devam et',
      orContinueWith: 'veya şununla devam et',
      enterDetails: 'Detaylarınızı girin',
      welcomeBack: 'Tekrar hoş geldiniz',
      getStarted: 'Başlayalım',
      choose_option: 'Nasıl başlamak istersiniz?',
      create_new_account: 'Yeni hesap oluştur',
      use_existing_account: 'Mevcut hesabınızı kullanın',
      secure_promise: 'Verileriniz bizimle güvende'
    },

    // Welcome & Onboarding
    welcome: {
      title: 'TaskFlow\'a Hoş Geldiniz',
      subtitle: 'Görevlerinizi organize edin, verimliliğinizi artırın',
      getStarted: 'Başlayın',
      skip: 'Geç',
      skip_intro: 'Tanıtımı Geç',
      continue_without_auth: 'Oturum açmadan devam et',
      guest_mode_info: 'Veriler cihazınızda saklanacak',
      hint: 'İstediğiniz zaman hesap oluşturabilirsiniz'
    },

    onboarding: {
      step1: {
        title: 'Görevlerinizi Organize Edin',
        description: 'Günlük görevlerinizi kolayca oluşturun, düzenleyin ve takip edin'
      },
      step2: {
        title: 'Takım ile İşbirliği',
        description: 'Takım arkadaşlarınızla projeler üzerinde birlikte çalışın'
      },
      step3: {
        title: 'İlerlemeyi Takip Edin',
        description: 'Ayrıntılı analizler ile verimliliğinizi artırın'
      }
    },

    // Admin
    admin: {
      dashboard: {
        title: 'Yönetici Paneli',
        subtitle: 'Şirket aktivitelerini yönetin'
      },
      invites: {
        title: 'Davetiyeler',
        subtitle: 'Takım üyelerini davet edin',
        create: {
          title: 'Yeni Davet Oluştur'
        },
        form: {
          email: {
            label: 'E-posta Adresleri',
            placeholder: 'ornek@sirket.com',
            required: 'En az bir e-posta adresi gerekli',
            help: 'Birden fazla e-posta için virgül veya enter kullanın'
          },
          role: {
            label: 'Rol',
            placeholder: 'Rol seçin',
            member: 'Üye',
            admin: 'Yönetici'
          },
          note: {
            label: 'Not (İsteğe bağlı)',
            placeholder: 'Davet için kişisel bir not ekleyin'
          }
        },
        send: 'Davet Gönder',
        table: {
          title: 'Gönderilen Davetiyeler',
          email: 'E-posta',
          role: 'Rol',
          status: 'Durum',
          sentAt: 'Gönderilme',
          expiresAt: 'Bitiş'
        },
        status: {
          pending: 'Bekliyor',
          accepted: 'Kabul Edildi',
          expired: 'Süresi Doldu'
        },
        actions: {
          resend: 'Tekrar Gönder',
          revoke: 'İptal Et'
        },
        sent: {
          success: '{count} davet başarıyla gönderildi',
          error: 'Davet gönderilirken hata oluştu'
        },
        resent: {
          success: 'Davet tekrar gönderildi',
          error: 'Davet tekrar gönderilirken hata oluştu'
        },
        revoked: {
          success: 'Davet iptal edildi',
          error: 'Davet iptal edilirken hata oluştu'
        },
        revoke: {
          confirm: {
            title: 'Daveti İptal Et',
            description: '{email} adresine gönderilen daveti iptal etmek istediğinizden emin misiniz?'
          }
        },
        empty: {
          title: 'Henüz davet gönderilmedi',
          description: 'Yeni takım üyeleri davet etmek için yukarıdaki formu kullanın'
        }
      },
      companySettings: {
        title: 'Şirket Ayarları',
        subtitle: 'Şirket profilini ve politikalarını yönetin',
        profile: {
          title: 'Şirket Profili',
          description: 'Temel şirket bilgilerini güncelleyin',
          name: 'Şirket Adı',
          'name.placeholder': 'Şirket adını girin',
          domain: 'Şirket Domain\'i',
          'domain.placeholder': 'ornek.com',
          'domain.help': 'Bu domain ile eşleşen e-posta adresleri otomatik olarak onaylanır',
          logo: 'Şirket Logosu',
          'logo.upload': 'Logo Yükle',
          'logo.help': 'JPG, PNG veya WebP. Maksimum 5MB.',
          'logo.uploaded': 'Logo başarıyla yüklendi',
          'logo.uploadError': 'Logo yüklenirken hata oluştu',
          'logo.sizeError': 'Dosya boyutu 5MB\'dan büyük olamaz',
          'logo.typeError': 'Sadece JPG, PNG ve WebP dosyaları desteklenir'
        },
        policies: {
          title: 'Politikalar ve Ayarlar',
          description: 'Şirket politikalarını yapılandırın',
          inviteExpiryDays: 'Davet Geçerlilik Süresi',
          day: 'gün',
          days: 'gün',
          approvalMode: {
            title: 'Onay Modu',
            auto: 'Otomatik Onay',
            'auto.description': 'Domain eşleşen e-postalar otomatik onaylanır',
            manual: 'Manuel Onay',
            'manual.description': 'Tüm başvurular manuel olarak incelenir'
          },
          requiresApproval: 'Onay Gereksinimi',
          'requiresApproval.description': 'Yeni üyelerin admin onayı gerektirmesi'
        },
        validation: {
          name: {
            required: 'Şirket adı gerekli'
          },
          domain: {
            invalid: 'Geçerli bir domain girin'
          },
          inviteExpiryDays: {
            range: '1-30 gün arasında bir değer girin'
          },
          hasErrors: 'Lütfen hataları düzeltin'
        },
        save: {
          error: 'Ayarlar kaydedilirken hata oluştu'
        },
        hasChanges: 'Kaydedilmemiş değişiklikler var',
        saved: 'Tüm değişiklikler kaydedildi'
      }
    },

    // Roles
    role: {
      individual: 'Bireysel',
      employee: 'Çalışan',
      admin: 'Yönetici',
      select: {
        title: 'Nasıl kullanacaksınız?',
        subtitle: 'Size en uygun deneyimi sunabilmemiz için rolünüzü seçin',
        individual: {
          title: 'Bireysel Kullanım',
          description: 'Kişisel görevlerinizi organize edin'
        },
        employee: {
          title: 'Şirket Çalışanı',
          description: 'Şirket workspace\'inde takım ile çalışın'
        },
        admin: {
          title: 'Takım Lideri',
          description: 'Takımınız için workspace oluşturun'
        }
      }
    },

    // Company
    company: {
      join: {
        title: 'Şirkete Katıl',
        subtitle: 'Şirket workspace\'ine erişim için bilgilerinizi girin',
        method: {
          title: 'Katılım yöntemini seçin',
          code: 'Şirket Kodu',
          email: 'İş E-postası'
        },
        form: {
          code: {
            placeholder: 'Şirket kodunu girin'
          },
          email: {
            placeholder: 'ornek@sirket.com'
          }
        },
        submit: 'Başvuru Gönder',
        createInstead: 'Bunun yerine şirket oluştur'
      },
      create: {
        title: 'Şirket Oluştur',
        subtitle: 'Takımınız için yeni bir workspace oluşturun',
        form: {
          name: {
            label: 'Şirket Adı',
            placeholder: 'Şirket adını girin'
          },
          domain: {
            label: 'Şirket Domain\'i (İsteğe bağlı)',
            placeholder: 'ornek.com'
          }
        },
        submit: 'Şirket Oluştur',
        joinInstead: 'Bunun yerine mevcut şirkete katıl'
      }
    },

    // Tasks
    tasks: {
      add: 'Görev Ekle',
      edit: 'Görevi Düzenle',
      title: 'Başlık',
      description: 'Açıklama',
      dueDate: 'Bitiş Tarihi',
      priority: 'Öncelik',
      category: 'Kategori',
      assignee: 'Atanan',
      status: 'Durum',
      completed: 'Tamamlandı',
      pending: 'Bekliyor',
      inProgress: 'Devam Ediyor',
      today: 'Bugün',
      upcoming: 'Yaklaşan',
      overdue: 'Gecikmiş',
      all: 'Tümü',
      none: 'Görev bulunamadı',
      empty: {
        title: 'Henüz görev yok',
        description: 'İlk görevinizi oluşturun'
      }
    },

    // Task Modal
    task: {
      add_task: 'Görev Ekle',
      create_new_task: 'Yeni görev oluştur',
      title: 'Başlık',
      title_placeholder: 'Ne yapılması gerekiyor?',
      description: 'Açıklama',
      natural_language_hint: '"Yarın 15:00 toplantı" veya "Acil: Raporu incele" deneyin',
      suggestion_calendar: 'Takvime ekle',
      suggestion_high_priority: 'Yüksek öncelik belirle',
      due_date: 'Son Tarih',
      next_week: 'Gelecek hafta',
      reminder_on: 'Açık',
      reminder_off: 'Kapalı',
      reminder_time: 'Hatırlatma',
      hide_advanced: 'Gelişmiş seçenekleri gizle',
      show_advanced: 'Gelişmiş seçenekleri göster',
      description_placeholder: 'Daha fazla detay ekle...',
      tags: 'Etiketler',
      add_tag: 'Etiket ekle...',
      subtasks: 'Alt Görevler',
      add_subtask: 'Alt görev ekle...',
      create_task: 'Görev Oluştur'
    },

    // Board
    board: {
      new: 'Yeni',
      inProgress: 'Devam Ediyor',
      pending: 'Bekliyor',
      done: 'Tamamlandı'
    }
  },

  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      confirm: 'Confirm',
      retry: 'Retry',
      loading: 'Loading...',
      saved: 'Saved',
      all: 'All',
      select: 'Select',
      clear: 'Clear',
      clearFilters: 'Clear Filters',
      refresh: 'Refresh',
      today: 'Today',
      tomorrow: 'Tomorrow',
      optional: '(optional)',
      error: {
        general: 'An error occurred',
        network: 'Network error',
        clipboardFailed: 'Failed to copy to clipboard'
      },
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      }
    },

    // Time
    time: {
      now: 'Now',
      minutesAgo: '{minutes} minutes ago',
      hoursAgo: '{hours} hours ago',
      daysAgo: '{days} days ago'
    },

    // Navigation
    nav: {
      home: 'Home',
      board: 'Board',
      profile: 'Profile',
      settings: 'Settings',
      admin: 'Admin'
    },

    // Task Menu Actions
    task: {
      menu: {
        moreActions: 'More actions',
        view: 'View details',
        edit: 'Edit',
        markComplete: 'Mark complete',
        markIncomplete: 'Mark incomplete',
        archive: 'Archive',
        delete: 'Delete',
        share: 'Share',
        linkCopied: 'Link copied to clipboard',
        markedComplete: 'Task marked as complete',
        markedIncomplete: 'Task marked as incomplete',
        archived: 'Task archived',
        deleted: 'Task deleted',
        deleteConfirm: {
          title: 'Delete Task',
          description: 'Are you sure you want to delete "{taskTitle}"? This action cannot be undone.'
        },
        archiveConfirm: {
          title: 'Archive Task',
          description: 'Are you sure you want to archive "{taskTitle}"?'
        }
      }
    },

    // Notifications
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark All as Read',
      seeAll: 'See All',
      clearAll: 'Clear All',
      unreadOnly: 'Unread Only',
      unreadCount: '{count} unread',
      allCaughtUp: 'All caught up!',
      empty: 'No notifications found',
      emptyDescription: 'New notifications will appear here.',
      noResults: 'No results found',
      noResultsWithFilters: 'No notifications match these filters.',
      error: 'Failed to load notifications',
      retry: 'Retry',
      refresh: 'Refresh',
      refreshed: 'Notifications refreshed',
      deleted: 'Notification deleted',
      deletedSelected: '{count} notifications deleted',
      clearedAll: 'All notifications cleared',
      markedAllRead: 'All notifications marked as read',
      filter: {
        type: 'Filter by Type',
        priority: 'Filter by Priority'
      },
      type: {
        task: 'Task',
        deadline: 'Deadline',
        reminder: 'Reminder',
        collaboration: 'Collaboration',
        system: 'System',
        completion: 'Completion'
      }
    },

    // Authentication
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      forgotPassword: 'Forgot Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      continueWithGoogle: 'Continue with Google',
      continueWithApple: 'Continue with Apple',
      orContinueWith: 'or continue with',
      enterDetails: 'Enter your details',
      welcomeBack: 'Welcome back',
      getStarted: 'Let\'s get started',
      choose_option: 'How would you like to get started?',
      create_new_account: 'Create a new account',
      use_existing_account: 'Use your existing account',
      secure_promise: 'Your data is secure with us'
    },

    // Welcome & Onboarding
    welcome: {
      title: 'Welcome to TaskFlow',
      subtitle: 'Organize your tasks, boost your productivity',
      getStarted: 'Get Started',
      skip: 'Skip',
      skip_intro: 'Skip Introduction',
      continue_without_auth: 'Continue without signing in',
      guest_mode_info: 'Your data will be stored locally',
      hint: 'You can create an account anytime'
    },

    onboarding: {
      step1: {
        title: 'Organize Your Tasks',
        description: 'Easily create, edit, and track your daily tasks'
      },
      step2: {
        title: 'Collaborate with Team',
        description: 'Work together with your teammates on projects'
      },
      step3: {
        title: 'Track Progress',
        description: 'Boost productivity with detailed analytics'
      }
    },

    // Admin
    admin: {
      dashboard: {
        title: 'Admin Dashboard',
        subtitle: 'Manage company activities'
      },
      invites: {
        title: 'Invites',
        subtitle: 'Invite team members',
        create: {
          title: 'Create New Invite'
        },
        form: {
          email: {
            label: 'Email Addresses',
            placeholder: 'example@company.com',
            required: 'At least one email address is required',
            help: 'Use comma or enter for multiple emails'
          },
          role: {
            label: 'Role',
            placeholder: 'Select role',
            member: 'Member',
            admin: 'Admin'
          },
          note: {
            label: 'Note (Optional)',
            placeholder: 'Add a personal note for the invite'
          }
        },
        send: 'Send Invite',
        table: {
          title: 'Sent Invites',
          email: 'Email',
          role: 'Role',
          status: 'Status',
          sentAt: 'Sent At',
          expiresAt: 'Expires At'
        },
        status: {
          pending: 'Pending',
          accepted: 'Accepted',
          expired: 'Expired'
        },
        actions: {
          resend: 'Resend',
          revoke: 'Revoke'
        },
        sent: {
          success: '{count} invite(s) sent successfully',
          error: 'Failed to send invite'
        },
        resent: {
          success: 'Invite resent successfully',
          error: 'Failed to resend invite'
        },
        revoked: {
          success: 'Invite revoked successfully',
          error: 'Failed to revoke invite'
        },
        revoke: {
          confirm: {
            title: 'Revoke Invite',
            description: 'Are you sure you want to revoke the invite sent to {email}?'
          }
        },
        empty: {
          title: 'No invites sent yet',
          description: 'Use the form above to invite new team members'
        }
      },
      companySettings: {
        title: 'Company Settings',
        subtitle: 'Manage company profile and policies',
        profile: {
          title: 'Company Profile',
          description: 'Update basic company information',
          name: 'Company Name',
          'name.placeholder': 'Enter company name',
          domain: 'Company Domain',
          'domain.placeholder': 'example.com',
          'domain.help': 'Email addresses matching this domain will be auto-approved',
          logo: 'Company Logo',
          'logo.upload': 'Upload Logo',
          'logo.help': 'JPG, PNG or WebP. Maximum 5MB.',
          'logo.uploaded': 'Logo uploaded successfully',
          'logo.uploadError': 'Failed to upload logo',
          'logo.sizeError': 'File size cannot exceed 5MB',
          'logo.typeError': 'Only JPG, PNG and WebP files are supported'
        },
        policies: {
          title: 'Policies & Settings',
          description: 'Configure company policies',
          inviteExpiryDays: 'Invite Expiry Days',
          day: 'day',
          days: 'days',
          approvalMode: {
            title: 'Approval Mode',
            auto: 'Automatic Approval',
            'auto.description': 'Domain-matching emails are auto-approved',
            manual: 'Manual Approval',
            'manual.description': 'All applications are manually reviewed'
          },
          requiresApproval: 'Requires Approval',
          'requiresApproval.description': 'New members require admin approval'
        },
        validation: {
          name: {
            required: 'Company name is required'
          },
          domain: {
            invalid: 'Enter a valid domain'
          },
          inviteExpiryDays: {
            range: 'Enter a value between 1-30 days'
          },
          hasErrors: 'Please fix the errors'
        },
        save: {
          error: 'Failed to save settings'
        },
        hasChanges: 'You have unsaved changes',
        saved: 'All changes saved'
      }
    },

    // Roles
    role: {
      individual: 'Individual',
      employee: 'Employee',
      admin: 'Admin',
      select: {
        title: 'How will you use this?',
        subtitle: 'Choose your role so we can provide the best experience',
        individual: {
          title: 'Personal Use',
          description: 'Organize your personal tasks'
        },
        employee: {
          title: 'Company Employee',
          description: 'Work with team in company workspace'
        },
        admin: {
          title: 'Team Leader',
          description: 'Create workspace for your team'
        }
      }
    },

    // Company
    company: {
      join: {
        title: 'Join Company',
        subtitle: 'Enter your information to access company workspace',
        method: {
          title: 'Choose join method',
          code: 'Company Code',
          email: 'Work Email'
        },
        form: {
          code: {
            placeholder: 'Enter company code'
          },
          email: {
            placeholder: 'example@company.com'
          }
        },
        submit: 'Submit Application',
        createInstead: 'Create company instead'
      },
      create: {
        title: 'Create Company',
        subtitle: 'Create a new workspace for your team',
        form: {
          name: {
            label: 'Company Name',
            placeholder: 'Enter company name'
          },
          domain: {
            label: 'Company Domain (Optional)',
            placeholder: 'example.com'
          }
        },
        submit: 'Create Company',
        joinInstead: 'Join existing company instead'
      }
    },

    // Tasks
    tasks: {
      add: 'Add Task',
      edit: 'Edit Task',
      title: 'Title',
      description: 'Description',
      dueDate: 'Due Date',
      priority: 'Priority',
      category: 'Category',
      assignee: 'Assignee',
      status: 'Status',
      completed: 'Completed',
      pending: 'Pending',
      inProgress: 'In Progress',
      today: 'Today',
      upcoming: 'Upcoming',
      overdue: 'Overdue',
      all: 'All',
      none: 'No tasks found',
      empty: {
        title: 'No tasks yet',
        description: 'Create your first task'
      }
    },

    // Task Modal
    task: {
      add_task: 'Add Task',
      create_new_task: 'Create a new task',
      title: 'Title',
      title_placeholder: 'What needs to be done?',
      description: 'Description',
      natural_language_hint: 'Try "Meeting tomorrow 3pm" or "Urgent: Review report"',
      suggestion_calendar: 'Add to calendar',
      suggestion_high_priority: 'Set high priority',
      due_date: 'Due Date',
      next_week: 'Next week',
      reminder_on: 'On',
      reminder_off: 'Off',
      reminder_time: 'Reminder',
      hide_advanced: 'Hide advanced',
      show_advanced: 'Show advanced',
      description_placeholder: 'Add more details...',
      tags: 'Tags',
      add_tag: 'Add tag...',
      subtasks: 'Subtasks',
      add_subtask: 'Add subtask...',
      create_task: 'Create Task'
    },

    // Board
    board: {
      new: 'New',
      inProgress: 'In Progress',
      pending: 'Pending',
      done: 'Done'
    }
  }
};

type Language = 'tr' | 'en';
type TranslationKey = string;

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskflow_language');
      if (saved === 'tr' || saved === 'en') {
        return saved;
      }
    }
    
    // Fallback to browser language detection
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr')) {
        return 'tr';
      }
    }
    
    return 'en';
  });

  const t = useMemo(() => {
    return (key: TranslationKey, fallback?: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found in current language
          let fallbackValue: any = translations.en;
          for (const fk of keys) {
            if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
              fallbackValue = fallbackValue[fk];
            } else {
              return fallback || key; // Return fallback or key if not found in any language
            }
          }
          value = fallbackValue;
          break;
        }
      }
      
      if (typeof value !== 'string') {
        return fallback || key;
      }
      
      // Replace parameters if provided
      if (params) {
        let result = value;
        Object.entries(params).forEach(([param, paramValue]) => {
          result = result.replace(new RegExp(`{${param}}`, 'g'), String(paramValue));
        });
        return result;
      }
      
      return value;
    };
  }, [language]);

  const dir: 'ltr' | 'rtl' = useMemo(() => {
    // Add RTL languages here when needed
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskflow_language', lang);
    }
  };

  const value = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t,
    dir
  }), [language, t, dir]);

  // Apply language and direction to document
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
  }, [language, dir]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}