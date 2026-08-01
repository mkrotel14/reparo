import type { PropsWithChildren } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { styles } from './screen.styles';

type AppScreenProps = PropsWithChildren<{ edges?: Edge[] }>;

export function AppScreen({ children, edges = ['top'] }: AppScreenProps) {
  return <SafeAreaView edges={edges} style={styles.screen}>{children}</SafeAreaView>;
}
