#!/usr/bin/env node

/**
 * Script per generare l'hash bcrypt di una password
 * Utile per creare ADMIN_PASSWORD_HASH in modo sicuro
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Generatore Hash Password Admin\n');
console.log('Questo script genera un hash bcrypt per la tua password.');
console.log('Puoi usarlo nel file .env come ADMIN_PASSWORD_HASH\n');

rl.question('Inserisci la password da hashare: ', async (password) => {
  if (!password || password.length < 4) {
    console.error('\n❌ Errore: La password deve essere almeno 4 caratteri\n');
    rl.close();
    process.exit(1);
  }

  console.log('\n⏳ Generazione hash in corso...\n');

  try {
    const hash = await bcrypt.hash(password, 10);
    
    console.log('✅ Hash generato con successo!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Aggiungi questa riga al tuo file .env:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Escape $ per docker-compose
    const escapedHash = hash.replace(/\$/g, '$$');
    console.log(`ADMIN_PASSWORD_HASH=${escapedHash}`);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Note:');
    console.log('   - Ricorda di commentare o rimuovere ADMIN_PASSWORD');
    console.log('   - Riavvia i container: docker compose restart backend');
    console.log('   - Non condividere mai questo hash pubblicamente\n');
    
  } catch (error) {
    console.error('\n❌ Errore durante la generazione:', error.message, '\n');
    process.exit(1);
  }
  
  rl.close();
});
