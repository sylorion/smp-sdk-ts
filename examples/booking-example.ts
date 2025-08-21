import { SMPClient, BookingController, BookingConfigurationController, ServiceType } from '../src/index.js';

// Exemple d'utilisation du système de booking
async function bookingExample() {
  // Initialiser le client SMP
  const smpClient = new SMPClient({
    appId: 'your-app-id',
    appSecret: 'your-app-secret',
    appRefreshDuration: 3600,
    userRefreshDuration: 1800,
    storage: 'localStorage'
  });

  // Authentifier l'application
  await smpClient.authenticateApp();

  // Créer les contrôleurs
  const bookingController = new BookingController(smpClient.apiClient);
  const configController = new BookingConfigurationController(smpClient.apiClient);

  try {
    // 1. Créer une configuration automatique pour un service horaire
    console.log('Création de la configuration de booking...');
    const config = await configController.createAutomaticConfiguration(
      'provider-123',
      'user-456',
      'service-789',
      ServiceType.HOURLY
    );
    console.log('Configuration créée:', config);

    // 2. Créer une demande de devis
    console.log('\nCréation d\'une demande de devis...');
    const estimateRequest = await bookingController.createEstimateRequest({
      serviceId: 'service-789',
      userId: 'user-456',
      requestedStartDate: new Date('2024-01-15T10:00:00Z'),
      requestedEndDate: new Date('2024-01-15T12:00:00Z'),
      requestedDuration: 120,
      description: 'Consultation technique',
      additionalRequirements: 'Équipement spécial requis'
    });
    console.log('Demande de devis créée:', estimateRequest);

    // 3. Créer une disponibilité hebdomadaire
    console.log('\nCréation d\'une disponibilité hebdomadaire...');
    const weeklyAvailability = await bookingController.createWeeklyAvailability({
      userId: 'user-456',
      serviceId: 'service-789',
      dayOfWeek: 1, // Lundi
      startTime: '09:00',
      endTime: '17:00'
    });
    console.log('Disponibilité hebdomadaire créée:', weeklyAvailability);

    // 4. Créer des créneaux quotidiens
    console.log('\nCréation de créneaux quotidiens...');
    const dailySlots = await bookingController.createDailySlots({
      userId: 'user-456',
      serviceId: 'service-789',
      dayOfWeek: 1,
      slots: [
        { startTime: '09:00', endTime: '10:00', capacity: 3 },
        { startTime: '10:00', endTime: '11:00', capacity: 3 },
        { startTime: '14:00', endTime: '15:00', capacity: 3 }
      ],
      replaceExisting: false
    });
    console.log('Créneaux quotidiens créés:', dailySlots);

    // 5. Vérifier la disponibilité d'un créneau
    console.log('\nVérification de la disponibilité...');
    const isAvailable = await bookingController.isSlotAvailable(
      'service-789',
      new Date('2024-01-15'),
      '10:00',
      '11:00'
    );
    console.log('Créneau 10:00-11:00 disponible:', isAvailable);

    // 6. Récupérer les créneaux disponibles
    console.log('\nRécupération des créneaux disponibles...');
    const availableSlots = await bookingController.getAvailableSlots({
      serviceId: 'service-789',
      date: new Date('2024-01-15'),
      slotDuration: 60
    });
    console.log('Créneaux disponibles:', availableSlots);

    // 7. Créer une réservation
    if (availableSlots.length > 0) {
      console.log('\nCréation d\'une réservation...');
      const booking = await bookingController.createBooking({
        availabilityId: availableSlots[0].slotId,
        userId: 'user-456',
        serviceId: 'service-789'
      });
      console.log('Réservation créée:', booking);
    }

    // 8. Récupérer les demandes de devis
    console.log('\nRécupération des demandes de devis...');
    const estimateRequests = await bookingController.getEstimateRequests('service-789');
    console.log('Demandes de devis:', estimateRequests);

    // 9. Récupérer la configuration
    console.log('\nRécupération de la configuration...');
    const serviceConfig = await configController.getBookingConfigurationByService('service-789');
    console.log('Configuration du service:', serviceConfig);

  } catch (error) {
    console.error('Erreur lors de l\'exécution:', error);
  }
}

// Exemple d'utilisation des méthodes utilitaires
function utilityExamples() {
  const bookingController = new BookingController({} as any);

  // Calculer la durée d'un créneau
  const duration = bookingController.calculateSlotDuration('10:00', '11:30');
  console.log('Durée du créneau 10:00-11:30:', duration, 'minutes');

  // Formater une durée
  const timeString = bookingController.formatTime(90);
  console.log('90 minutes formatées:', timeString);
}

// Exécuter les exemples
if (typeof window === 'undefined') {
  // Node.js environment
  bookingExample().catch(console.error);
  utilityExamples();
}

export { bookingExample, utilityExamples };
