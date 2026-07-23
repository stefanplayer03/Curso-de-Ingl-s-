import { useEffect, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/Button";
import { GoalSelector } from "@/components/settings/GoalSelector";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileService } from "@/services/userProfile.service";
import { GOAL_OPTIONS } from "@/constants/goals";
import type { UserGoal } from "@/types/user.types";

export function SettingsPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Sincroniza a seleção local assim que o perfil carrega do Firestore.
  useEffect(() => {
    if (profile) setSelectedIds(profile.goals.map((g) => g.id));
  }, [profile]);

  function toggleGoal(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  async function handleSave() {
    if (!firebaseUser) return;
    setIsSaving(true);
    const goals: UserGoal[] = GOAL_OPTIONS.filter((option) => selectedIds.includes(option.id)).map(
      (option) => ({ id: option.id, label: option.label })
    );
    await UserProfileService.updateGoals(firebaseUser.uid, goals);
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  }

  async function handleToggleImmersion(enabled: boolean) {
    if (!firebaseUser) return;
    await UserProfileService.updateImmersionMode(firebaseUser.uid, enabled);
  }

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-lg flex-col gap-8 py-16">
        <h1 className="text-center font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          Configurações
        </h1>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink dark:text-ink-dark">
            Modo Imersão
          </h2>
          <p className="mb-4 font-body text-sm text-ink-soft dark:text-ink-dark/70">
            Quando ativado, a professora nunca responde em português nem traduz — só
            inglês, o tempo todo, mesmo se você escrever em português.
          </p>
          <ToggleSwitch
            checked={profile?.immersionMode ?? false}
            onChange={handleToggleImmersion}
            label="Conversar só em inglês"
            description="Vale a partir da sua próxima mensagem na Conversação."
          />
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink dark:text-ink-dark">
            Seus objetivos
          </h2>
          <p className="mb-4 font-body text-sm text-ink-soft dark:text-ink-dark/70">
            Escolha o que você quer conquistar com o inglês — a professora usa isso pra
            escolher os temas das suas próximas conversas.
          </p>
          <GoalSelector selectedIds={selectedIds} onToggle={toggleGoal} />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} isLoading={isSaving}>
            Salvar objetivos
          </Button>
          {showSaved && <span className="font-body text-sm text-success">Salvo!</span>}
        </div>
      </div>
    </AppLayout>
  );
}
