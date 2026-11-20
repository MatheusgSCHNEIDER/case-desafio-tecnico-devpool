<script setup>
import { ref, onMounted } from 'vue';
import { userApi } from './services/userService.js';
import UserForm from './components/UserForm.vue';
import UserList from './components/UserList.vue';
import ConfirmModal from './components/ConfirmModal.vue';

const users = ref([]);
const loadingList = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showForm = ref(false);
const showFormUserList = ref(true);
const editingUser = ref(null);
const userToDelete = ref(null);
const formRef = ref(null);
const currentSearchTerm = ref('');

const feedback = ref({
  type: '', // 'success' | 'error'
  message: '',
});

let feedbackTimeout = null;

function showFeedback(type, message) {
  feedback.value = { type, message };
  clearTimeout(feedbackTimeout);
  feedbackTimeout = setTimeout(() => {
    feedback.value = { type: '', message: '' };
  }, 5000);
}

function extractErrorMessage(err, fallback) {
  if (err.response?.data?.error) {
    return err.response.data.error;
  }
  if (err.code === 'ERR_NETWORK') {
    return 'Não foi possível conectar ao servidor.';
  }
  return fallback;
}

function startCreate() {
  editingUser.value = null; // Garante formulário limpo (modo cadastro)
  showForm.value = true;
  showFormUserList.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeForm() {
  editingUser.value = null;
  showForm.value = false;
  showFormUserList.value = true;
}

async function fetchUsers() {
  currentSearchTerm.value = '';
  loadingList.value = true;
  try {
    users.value = await userApi.getAll();
  } catch (err) {
    showFeedback('error', extractErrorMessage(err, 'Erro ao carregar a lista de usuários.'));
  } finally {
    loadingList.value = false;
  }
}

async function handleSearch(term) {
  currentSearchTerm.value = term;
  loadingList.value = true;
  try {
    users.value = await userApi.search(term);
  } catch (err) {
    showFeedback('error', extractErrorMessage(err, 'Erro ao realizar a busca.'));
  } finally {
    loadingList.value = false;
  }
}

async function reloadList() {
  if (currentSearchTerm.value) {
    await handleSearch(currentSearchTerm.value);
  } else {
    await fetchUsers();
  }
}

async function handleSaveUser(payload) {
  saving.value = true;
  try {
    if (editingUser.value) {
      await userApi.update(editingUser.value.id, payload);
      showFeedback('success', 'Usuário atualizado com sucesso!');
      editingUser.value = null;
      closeForm();
    } else {
      await userApi.create(payload);
      showFeedback('success', 'Usuário cadastrado com sucesso!');
      formRef.value?.resetForm();
    }
    await reloadList();
  } catch (err) {
    showFeedback('error', extractErrorMessage(err, 'Erro ao salvar usuário.'));
  } finally {
    saving.value = false;
  }
}

function startEdit(user) {
  showForm.value = true;
  editingUser.value = { ...user };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function askDelete(user) {
  userToDelete.value = user;
}

async function confirmDelete() {
  if (!userToDelete.value) return;
  const targetUser = userToDelete.value;
  deleting.value = true;
  try {
    await userApi.delete(targetUser.id);
    showFeedback('success', `Usuário "${userToDelete.value.name}" excluído com sucesso!`);
    if (editingUser.value?.id === targetUser.id) {
      editingUser.value = null;
    }
    userToDelete.value = null;
    await reloadList();
  } catch (err) {
    showFeedback('error', extractErrorMessage(err, 'Erro ao excluir usuário.'));
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <main class="container">
    <header class="page-header">
      <h1>Gestão de Usuários</h1>
    
    </header>

    <div
      v-if="feedback.message"
      :class="['alert', feedback.type === 'success' ? 'alert-success' : 'alert-error']"
    >
      <span>{{ feedback.message }}</span>
      <button type="button" class="close-alert" @click="feedback.message = ''">×</button>
    </div>

    <UserForm
      v-if="showForm"
      ref="formRef"
      :editing-user="editingUser"
      :loading="saving"
      @submit="handleSaveUser"
      @cancel="closeForm"
    />

    <UserList
      v-show="showFormUserList"
      :users="users"
      :loading="loadingList"
      @create="startCreate"
      @edit="startEdit"
      @delete="askDelete"
      @search="handleSearch"
      @clear-search="fetchUsers"
    />

    <ConfirmModal
      :visible="Boolean(userToDelete)"
      :user-name="userToDelete?.name"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="userToDelete = null"
    />
  </main>
</template>

<style>
:root {
  --bg-page: #0b1120;
  --bg-surface: #131c31;
  --bg-elevated: #1c2742;
  --bg-input: #0f172a;
  --border-color: #26334d;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent-primary: #3b82f6;
  --accent-primary-hover: #2563eb;
  --accent-edit: #d97706;
  --accent-danger: #ef4444;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.page-header p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
}

.alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-weight: 500;
}

.alert-success {
  background: rgba(22, 163, 74, 0.16);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.alert-error {
  background: rgba(220, 38, 38, 0.16);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.close-alert {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
}

.btn {
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, opacity 0.15s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.35rem 0.7rem;
  font-size: 0.82rem;
}

.btn-primary {
  background: var(--accent-primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-primary-hover);
}

.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: #3c569465;
}

.btn-edit {
  background: rgba(217, 119, 6, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.btn-edit:hover:not(:disabled) {
  background: rgba(217, 119, 6, 0.32);
}

.btn-danger {
  background: rgba(220, 38, 38, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.35);
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.2rem;
  }
  .container{
    width: 95%;
    margin: 0 auto;
  }
  * {
  box-sizing: border-box;
}

}
</style>