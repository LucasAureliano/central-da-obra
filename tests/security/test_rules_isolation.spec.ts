import { initializeTestEnvironment, assertFails, assertSucceeds, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  // Inicializa o ambiente de testes com as regras locais
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-centralobra',
    firestore: {
      rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
    },
    storage: {
      rules: readFileSync(resolve(__dirname, '../../storage.rules'), 'utf8'),
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.clearStorage();
});

describe('Firestore Rules Security & Isolation', () => {

  it('não deve permitir que usuários leiam obras de outros usuários', async () => {
    // Setup inicial (User A possui uma obra)
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await db.collection('works').doc('obraA').set({
        userId: 'user_a',
        name: 'Obra do User A',
        roles: {
          'user_a': 'owner'
        }
      });
    });

    // Teste: User B tenta ler
    const userB = testEnv.authenticatedContext('user_b');
    const q = userB.firestore().collection('works').doc('obraA');
    
    await assertFails(q.get());
  });

  it('deve permitir acesso se usuário for membro da obra via roles', async () => {
    // Setup
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await db.collection('works').doc('obraB').set({
        userId: 'user_a',
        roles: {
          'user_c': 'editor' // User C foi convidado
        }
      });
    });

    // Teste: User C tenta ler
    const userC = testEnv.authenticatedContext('user_c');
    const docRef = userC.firestore().collection('works').doc('obraB');
    
    await assertSucceeds(docRef.get());
  });

  it('visitantes (guest) não devem conseguir criar works', async () => {
    // Anônimo sem claim específica / ou mock de isAnonymous
    const guest = testEnv.authenticatedContext('guest_123', {
      firebase: {
        sign_in_provider: 'anonymous'
      }
    });

    const docRef = guest.firestore().collection('works').doc('obraGuest');
    await assertFails(docRef.set({
      userId: 'guest_123',
      name: 'Obra Fake'
    }));
  });

});
