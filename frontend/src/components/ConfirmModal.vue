<script setup>
defineProps({
  visible: Boolean,
  userName: String,
  loading: Boolean,
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="emit('cancel')">
    <div class="modal-card">
      <h3>Confirmar Exclusão</h3>
      <p>
        Tem certeza que deseja excluir o usuário
        <strong>{{ userName }}</strong>? Esta ação não poderá ser desfeita.
      </p>
      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="loading"
          @click="emit('cancel')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="loading"
          @click="emit('confirm')"
        >
          {{ loading ? 'Excluindo...' : 'Sim, excluir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 10px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.5);
}

.modal-card h3 {
  margin: 0 0 0.75rem;
  color: var(--text-primary);
}

.modal-card p {
  margin: 0 0 1.25rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-card strong {
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* No modal, deixa o botão de confirmar exclusão sólido para máximo destaque */
.modal-actions .btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
}

.modal-actions .btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}
</style>