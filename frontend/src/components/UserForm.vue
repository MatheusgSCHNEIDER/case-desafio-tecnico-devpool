<script setup>
import { reactive, watch, computed, ref } from 'vue';
import olhoVisivel from '../assets/images/olho-visivel.png';
import olhoInvisivel from '../assets/images/olho-invisivel.png';
import informacao from '../assets/images/informacoes.png'


const props = defineProps({
  editingUser: {
    type: Object,
    default: null,
  },
  loading: Boolean,
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  name: '',
  email: '',
  login: '',
  password: '',
  active: true,
});

const isEditing = computed(() => Boolean(props.editingUser));

watch(
  () => props.editingUser,
  (user) => {
    if (user) {
      form.name = user.name;
      form.email = user.email;
      form.login = user.login;
      form.password = '';
      form.active = Boolean(user.active);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const showPassword = ref(false);

function resetForm() {
  form.name = '';
  form.email = '';
  form.login = '';
  form.password = '';
  form.active = true;
}

function handleSubmit() {
  const payload = {
    name: form.name,
    email: form.email,
    login: form.login,
    active: form.active,
  };

  // No cadastro a senha é sempre enviada; na edição, só envia se o usuário digitou uma nova
  if (!isEditing.value || form.password.trim() !== '') {
    payload.password = form.password;
  }

  emit('submit', payload);
}

defineExpose({ resetForm });
</script>

<template>
  <form class="form-card" @submit.prevent="handleSubmit">
    <h2>{{ isEditing ? `Editar Usuário #${editingUser.id}` : 'Novo Usuário' }}</h2>

    <div class="form-grid">
      <div class="field">
        <label for="name">Nome <a class="asterisco">*</a></label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Mínimo 3 caracteres"
          minlength="3"
          required
          :disabled="loading"
        />
      </div>

      <div class="field">
        <label for="email">E-mail <a class="asterisco">*</a></label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="usuario@dominio.com"
          required
          :disabled="loading"
        />
      </div>

      <div class="field">
        <label for="login">Login <a class="asterisco">*</a></label>
        <input
          id="login"
          v-model="form.login"
          type="text"
          placeholder="Mínimo 3 caracteres"
          minlength="3"
          required
          :disabled="loading"
        />
      </div>

    <div class="field">
        <label for="password">
          {{ isEditing ? 'Nova Senha (opcional) ' : 'Senha ' }}<a v-if="!isEditing" class="asterisco">* </a>
          <span class="iconi-i-container">
          <img :src="informacao" class="iconi-i-imagem" alt="Requisitos da senha"/>
        <span class="iconi-i">
              Mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.
            </span>
          </span>
        </label>
        
        <div class="password-wrapper">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="
              isEditing
                ? 'Não preencha para manter a atual'
                : 'Mín. 8 caracteres (letras e números)'
            "
            minlength="8"
            pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
            title="A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra e um número."
            :required="!isEditing"
            :disabled="loading"
          />

          <button
            type="button"
            class="toggle-password"
            :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            :disabled="loading"
            @click="showPassword = !showPassword"
          >
            <!-- Se estiver usando sua imagem local (ajuste o caminho/extensão): -->
            <img class="olho-senha"
              :src="showPassword ? olhoInvisivel : olhoVisivel"
              alt="Alternar visibilidade da senha"
            />
          </button>
        </div>
      </div>  
    </div>

    <div class="checkbox-field">
      <input
        id="active"
        v-model="form.active"
        type="checkbox"
        :disabled="loading"
      />
      <label for="active">Usuário Ativo</label>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário' }}
      </button>
      <button
        v-if="isEditing"
        type="button"
        class="btn btn-secondary"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Cancelar Edição
      </button>
      <button
        v-else
        type="button"
        class="btn btn-secondary"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Voltar
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-card {
  background: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.form-card h2 {
  margin: 0 0 1.25rem;
  font-size: 1.2rem;
  color: var(--text-primary);
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.25rem;
  max-width: 640px;
  margin: 0 auto;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.field input {
  padding: 0.6rem 0.75rem;
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field input::placeholder {
  color: #475569;
}

.field input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.checkbox-field {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.checkbox-field input[type='checkbox'] {
  accent-color: var(--accent-primary);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.iconi-i-container {
    position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help; 
}

.iconi-i-imagem {
    max-height: 13px;
    max-width: 13px;
}

.iconi-i{
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 230px;
  padding: 0.55rem 0.75rem;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
  z-index: 20;
  pointer-events: none;
  transition: opacity 0.15s ease, visibility 0.15s ease;  
}

.iconi-i::after {
    content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: var(--border-color) transparent transparent transparent;
}

.iconi-i-container:hover .iconi-i {
  visibility: visible;
  opacity: 1;
}

.asterisco {
  color: rgb(199, 2, 2);
}

.olho-senha {
  width: 25px;
  height: 25px;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.5rem; /* Espaço à direita para o ícone não sobrepor o texto */
}

.toggle-password {
  position: absolute;
  right: 0.65rem;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.75;
  transition: opacity 0.15s;
}

.toggle-password:hover:not(:disabled) {
  opacity: 1;
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.toggle-password img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

@media (max-width: 600px) {
  .form-card {
    padding: 1.15rem;
  }

  .form-card h2 {
    font-size: 1.05rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .field input {
    width: 100%;
    font-size: 16px; /* Evita zoom automático no Safari/iOS ao focar o campo */
  }

  .form-actions {
    flex-direction: column; /* Empilha os botões "Salvar" e "Cancelar" no celular */
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>