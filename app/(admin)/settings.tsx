import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Percent, Globe, Bell, Database, Shield, LogOut, ChevronRight, Tag, FileText } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function AdminSettingsScreen() {
  const { colors } = useTheme();
  const { logout } = useAuthStore();

  const settingsGroups = [
    {
      title: 'Plataforma',
      items: [
        { icon: Percent, label: 'Comisiones', detail: '15%', color: colors.roleAdmin },
        { icon: Tag, label: 'Categorías globales', detail: '10', color: colors.warning },
        { icon: Globe, label: 'Zonas de cobertura', detail: 'Tuxtepec', color: colors.info },
      ],
    },
    {
      title: 'Integraciones',
      items: [
        { icon: Shield, label: 'Mercado Pago', detail: 'Configurar', color: '#009EE3' },
        { icon: Bell, label: 'Notificaciones push', detail: 'Activas', color: colors.success },
        { icon: Database, label: 'Base de datos', detail: 'Supabase', color: colors.roleRestaurante },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { icon: FileText, label: 'Logs del sistema', detail: '', color: colors.textSecondary },
        { icon: Shield, label: 'Seguridad', detail: '', color: colors.error },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
            <Card>
              {group.items.map((item, index) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity style={styles.settingRow} activeOpacity={0.6}>
                    <View style={[styles.settingIcon, { backgroundColor: item.color + '15' }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                    {item.detail ? (
                      <Text style={[styles.settingDetail, { color: colors.textTertiary }]}>{item.detail}</Text>
                    ) : null}
                    <ChevronRight size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                  {index < group.items.length - 1 && <View style={[styles.separator, { backgroundColor: colors.divider }]} />}
                </React.Fragment>
              ))}
            </Card>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => logout()}
          style={[styles.logoutBtn, { backgroundColor: colors.errorLight }]}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  group: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  groupTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
  settingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium, marginLeft: SPACING.lg },
  settingDetail: { fontSize: FONT_SIZE.sm, marginRight: SPACING.sm },
  separator: { height: 1, marginLeft: 56 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginHorizontal: SPACING.xl, marginTop: SPACING.sm, padding: SPACING.lg, borderRadius: RADIUS.lg },
  logoutText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
});
