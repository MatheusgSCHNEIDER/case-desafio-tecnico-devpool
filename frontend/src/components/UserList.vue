<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  loading: Boolean,
});

const emit = defineEmits(['edit', 'delete', 'search', 'clearSearch', 'create']);

const searchTerm = ref('');
const statusFilter = ref('active');

const filteredUsers = computed(() => {
  return props.users.filter((user) => {
    if (statusFilter.value === 'active') return Boolean(user.active) === true;
    if (statusFilter.value === 'inactive') return Boolean(user.active) === false;
    return true; // 'all'
  });
});

function onSearch() {
  if (searchTerm.value.trim() === '') {
    emit('clearSearch');
  } else {
    emit('search', searchTerm.value.trim());
  }
}

function onClear() {
  searchTerm.value = '';
  emit('clearSearch');
}
</script>

<template>
  <div class="list-card">
    <div class="list-header">
      <h2>Usuários Cadastrados</h2>
      <form class="search-bar" @submit.prevent="onSearch">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nome, e-mail ou login..."
          :disabled="loading"
        />
        <button type="submit" class="btn btn-primary" :disabled="loading">
          Buscar
        </button>
        <button
          v-if="searchTerm"
          type="button"
          class="btn btn-secondary"
          :disabled="loading"
          @click="onClear"
        >
          Limpar
        </button>
      </form>
    </div>
    <div class="filter-bar">
      <div class="box-btn-usuario">
        <button type="button" class="btn btn-primary" @click="emit('create')">Cadastrar Usuário</button>
      </div>

      <div class="box-filtro-situacao">
        <label for="status-filter">Situação:</label>
        <select id="status-filter" v-model="statusFilter" class="seletor-situacao">
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="all">Todos</option>
        </select>
      </div> 
    </div>

    <div v-if="loading" class="state-box">
      Carregando usuários...
    </div>

    <div v-else-if="filteredUsers.length === 0" class="state-box">
      Nenhum usuário encontrado.
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Login</th>
            <th>E-mail</th>
            <th>Status</th>
            <th class="actions-col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>#{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.login }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['badge', user.active ? 'badge-active' : 'badge-inactive']">
                {{ user.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="actions-col">
              <button
                type="button"
                class="btn btn-sm btn-edit"
                @click="emit('edit', user)"
              >
                Editar
              </button>
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="emit('delete', user)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.list-card {
  background: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.list-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.list-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.search-bar input {
  padding: 0.5rem 0.75rem;
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  min-width: 240px;
}

.search-bar input::placeholder {
  color: #475569;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.state-box {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.95rem;
}

th {
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

tbody tr {
  transition: background-color 0.15s;
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.actions-col {
  text-align: right;
  padding-right: 2%;
  white-space: nowrap;
}

.actions-col button + button {
  margin-left: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-active {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-inactive {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-bar label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.box-filtro-situacao {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.seletor-situacao {
  padding: 0.40rem 0.70rem;
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.seletor-situacao:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.box-btn-usuario {
  justify-content: left;
  text-align: left;
}

@media (max-width: 600px) {
  .list-card {
    padding: 1.15rem;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .search-bar {
    width: 100%;
  }

  .search-bar input {
    min-width: 0; 
    flex: 1;
    font-size: 16px;
  }

  .filter-bar label {
    text-align: right;
  }
.table-wrapper {
  width: 95%;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  }
}
</style>