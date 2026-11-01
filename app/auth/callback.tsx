import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import type { EmailOtpType } from '@supabase/supabase-js';
import { COLORS } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const routeParams = useLocalSearchParams<{ code?: string; token_hash?: string; type?: string; access_token?: string; refresh_token?: string; error_description?: string }>();
  const url = Linking.useLinkingURL();
  const parsed = useMemo(() => {
    const query = Linking.parse(url ?? '').queryParams ?? {};
    const fragment = new URLSearchParams(url?.split('#')[1] ?? '');
    const value = (key: string) => {
      const fromRoute = routeParams[key as keyof typeof routeParams];
      const fromQuery = query[key];
      const fromFragment = fragment.get(key);
      const first = Array.isArray(fromRoute) ? fromRoute[0] : fromRoute;
      const queryValue = Array.isArray(fromQuery) ? fromQuery[0] : fromQuery;
      return first ?? queryValue ?? fromFragment ?? undefined;
    };
    return { code: value('code'), tokenHash: value('token_hash'), type: value('type'), accessToken: value('access_token'), refreshToken: value('refresh_token'), errorDescription: value('error_description') };
  }, [url, routeParams]);
  const [error, setError] = useState(parsed.errorDescription ?? '');

  useEffect(() => {
    let active = true;
    if (parsed.errorDescription) return () => { active = false; };
    if (!parsed.code && !parsed.tokenHash && !(parsed.accessToken && parsed.refreshToken)) return () => { active = false; };

    const completeVerification = async () => {
      let exchangeError: Error | null = null;
      if (parsed.code) {
        const result = await supabase.auth.exchangeCodeForSession(parsed.code);
        exchangeError = result.error;
      } else if (parsed.tokenHash) {
        const otpType = parsed.type === 'signup' || parsed.type === 'email' ? parsed.type as EmailOtpType : 'signup';
        const result = await supabase.auth.verifyOtp({ token_hash: parsed.tokenHash, type: otpType });
        exchangeError = result.error;
      } else if (parsed.accessToken && parsed.refreshToken) {
        const result = await supabase.auth.setSession({ access_token: parsed.accessToken, refresh_token: parsed.refreshToken });
        exchangeError = result.error;
      }
      if (!active) return;
      if (exchangeError) setError(exchangeError.message);
      else router.replace('/(tabs)');
    };

    void completeVerification().catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Unable to verify this link.');
    });
    return () => { active = false; };
  }, [parsed]);
  const visibleError = parsed.errorDescription ?? error;

  return <View style={styles.screen}>
    {visibleError ? <>
      <Feather name="alert-circle" size={28} color={COLORS.danger} />
      <Text style={styles.title}>Verification failed</Text>
      <Text style={styles.message}>{visibleError}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}><Text style={styles.buttonText}>Return to sign in</Text></TouchableOpacity>
    </> : <>
      <ActivityIndicator size="large" color={COLORS.cyan} />
      <Text style={styles.title}>Verifying your email</Text>
      <Text style={styles.message}>Please wait while we finish setting up your account.</Text>
    </>}
  </View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F4F7FA', alignItems: 'center', justifyContent: 'center', padding: 28 }, title: { color: '#15202B', fontSize: 19, fontWeight: '700', marginTop: 16, textAlign: 'center' }, message: { color: '#526171', fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: 'center' }, button: { minHeight: 46, paddingHorizontal: 18, borderRadius: 10, backgroundColor: COLORS.cyan, alignItems: 'center', justifyContent: 'center', marginTop: 22 }, buttonText: { color: '#0B0F17', fontWeight: '700', fontSize: 13 } });
