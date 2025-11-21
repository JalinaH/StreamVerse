import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { NeonButton } from '../../src/components/ui/NeonButton';
import type { AuthState } from '../../src/features/auth/authSlice';
import { deleteProfile, logout, updateProfile } from '../../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const { profileStatus, profileError } = useSelector((state: RootState) => state.auth as AuthState);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const isProfileLoading = profileStatus === 'loading';

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(formValues)).unwrap();
      Alert.alert('Profile updated', 'Your changes have been saved.');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Update failed', error ?? 'Unable to update profile.');
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormValues({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This action permanently deletes your profile and favourites.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteProfile()).unwrap();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Delete failed', error ?? 'Unable to delete account.');
            }
          },
        },
      ],
    );
  };

  const handleChangeAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission needed', 'Enable photo library access to update your avatar.');
      return;
    }

    const resolveMediaTypes = (): any => {
      const mediaTypeEnum = (ImagePicker as any).MediaType;
      if (mediaTypeEnum?.Images) {
        return [mediaTypeEnum.Images];
      }
      return ImagePicker.MediaTypeOptions.Images;
    };

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: resolveMediaTypes(),
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets?.length || !result.assets[0].base64) {
      return;
    }

    const asset = result.assets[0];
    const dataUri = `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;

    try {
      await dispatch(updateProfile({ avatarBase64: dataUri })).unwrap();
      Alert.alert('Avatar updated', 'Your profile photo has been refreshed.');
    } catch (error: any) {
      Alert.alert('Upload failed', error ?? 'Unable to update avatar.');
    }
  };

  const settings = [
    {
      key: 'edit',
      label: 'Edit Profile',
      subtitle: 'Update your basic information',
      onPress: () => setIsEditing(true),
    },
    {
      key: 'photo',
      label: 'Change Photo',
      subtitle: 'Upload a new avatar image',
      onPress: handleChangeAvatar,
    },
    {
      key: 'delete',
      label: 'Delete Account',
      subtitle: 'Remove your profile permanently',
      onPress: handleDeleteAccount,
      destructive: true,
    },
  ];

  if (!user) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <AppHeader />
          <View style={styles.content}>
            <Text style={{ color: 'white' }}>Loading...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Profile</Text>
          <GlassView style={styles.profileCard}>
            <Image
              source={{
                uri:
                  user.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=0f172a&color=ffffff`,
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </GlassView>

          {isEditing && (
            <GlassView style={styles.editCard}>
              <Text style={styles.sectionTitle}>Edit details</Text>
              <ProfileInput
                label="First Name"
                value={formValues.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
              <ProfileInput
                label="Last Name"
                value={formValues.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
              <ProfileInput
                label="Username"
                value={formValues.username}
                autoCapitalize="none"
                onChangeText={(text) => handleInputChange('username', text)}
              />
              <ProfileInput
                label="Email"
                value={formValues.email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => handleInputChange('email', text)}
              />
              <View style={styles.editActions}>
                <NeonButton
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  loading={isProfileLoading}
                />
                <NeonButton
                  title="Cancel"
                  variant="secondary"
                  onPress={handleCancelEdit}
                  style={styles.cancelButton}
                />
              </View>
            </GlassView>
          )}

          <GlassView style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Text style={styles.sectionTitle}>Settings</Text>
            </View>
            {settings.map(({ key, ...rest }) => (
              <SettingsRow key={key} {...rest} disabled={isProfileLoading} />
            ))}
          </GlassView>

          {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}

          <NeonButton
            title="LOGOUT"
            onPress={() => dispatch(logout())}
            variant="secondary"
            style={styles.logoutButton}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

interface ProfileInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const ProfileInput = ({ label, value, onChangeText, keyboardType = 'default', autoCapitalize = 'sentences' }: ProfileInputProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      placeholderTextColor={colors.text.secondary}
    />
  </View>
);

interface SettingsRowProps {
  label: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

const SettingsRow = ({ label, subtitle, onPress, destructive, disabled }: SettingsRowProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.settingsRow,
      pressed && styles.settingsRowPressed,
      destructive && styles.settingsRowDanger,
    ]}
  >
    <View>
      <Text style={[styles.rowLabel, destructive && styles.dangerText]}>{label}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Feather name="chevron-right" size={18} color={destructive ? colors.status.error : colors.text.secondary} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  profileCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.text.accent,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  editCard: {
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: 16,
    color: colors.text.primary,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  editActions: {
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
  settingsCard: {
    paddingTop: 20,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  settingsHeader: {
    paddingHorizontal: 24,
  },
  settingsRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsRowPressed: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  settingsRowDanger: {
    borderTopColor: 'rgba(239,68,68,0.3)',
  },
  rowLabel: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 4,
  },
  dangerText: {
    color: colors.status.error,
  },
  logoutButton: {
    marginTop: 24,
  },
  errorText: {
    color: colors.status.error,
    textAlign: 'center',
    marginTop: 12,
  },
});