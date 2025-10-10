<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Skanuj kod QR</h3>
        <button 
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-64 flex items-center justify-center">
        <div v-if="isLoading" class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-gray-600">Inicjalizacja kamery...</p>
        </div>
        
        <div v-else-if="cameraError" class="text-center">
          <div class="text-red-500 text-4xl mb-2">📷</div>
          <p class="text-red-600 font-medium mb-2">Błąd kamery</p>
          <p class="text-gray-600 text-sm mb-4">{{ cameraError }}</p>
          <BaseButton 
            label="Spróbuj ponownie" 
            @click="initializeCamera"
            variant="outline"
          />
        </div>
        
        <qrcode-stream 
          v-else-if="isCameraActive"
          @detect="onDetect"
          @error="onError"
          @camera-on="onCameraOn"
          @camera-off="onCameraOff"
          :camera="camera"
          :constraints="cameraConstraints"
        />
        
        <div v-else class="text-center">
          <div class="text-gray-400 text-4xl mb-2">📷</div>
          <p class="text-gray-500">Przygotowywanie kamery...</p>
        </div>
        
        <div v-if="scanError" class="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {{ scanError }}
        </div>
        
        <div v-if="isValidating" class="mt-4 p-3 bg-blue-100 text-blue-700 rounded">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Przetwarzanie kodu QR...
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex justify-between">
        <BaseButton 
          label="Przełącz kamerę" 
          @click="switchCamera"
          :disabled="isValidating || isLoading || !!cameraError"
        />
        <BaseButton 
          label="Anuluj" 
          @click="closeModal"
        />
      </div>

      <!-- Hints for users -->
      <div class="mt-4 p-3 bg-primary-50 rounded text-sm text-primary-700">
        <p class="font-medium">Wskazówki:</p>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li>Zezwól na dostęp do kamery</li>
          <li>Upewnij się, że kod QR jest dobrze oświetlony</li>
          <li>Trzymaj telefon stabilnie</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

interface QrData {
  name?: string;
  birthday?: string;
  sex?: string;
  phone?: string;
  
  animal?: string;
  animal_sex?: string;
  breed?: string;
  animal_name?: string;
  animal_age?: string;
  animal_height?: string;
  animal_weight?: string;
  chip?: string;
}

const emit = defineEmits<{
  close: [];
  scanned: [data: QrData];
}>();

const isCameraActive = ref(false);
const isLoading = ref(true);
const isValidating = ref(false);
const scanError = ref('');
const cameraError = ref('');
const camera = ref('auto');
const cameraConstraints = ref({
  facingMode: 'environment',
  width: { min: 640, ideal: 1280, max: 1920 },
  height: { min: 480, ideal: 720, max: 1080 }
});

const initializeCamera = async () => {
  try {
    isLoading.value = true;
    cameraError.value = '';
    scanError.value = '';
    isCameraActive.value = true;
    
    console.log('Initializing camera...');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Twoja przeglądarka nie obsługuje dostępu do kamery');
    }
    
    const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
    console.log('Camera permission state:', permissions.state);
    
  } catch (err: any) {
    console.error('Camera initialization error:', err);
    cameraError.value = err.message || 'Nie można uruchomić kamery';
    isCameraActive.value = false;
  } finally {
    isLoading.value = false;
  }
};

const onDetect = async (detectedCodes: any[]) => {
  if (isValidating.value || !detectedCodes.length) return;
  
  isValidating.value = true;
  scanError.value = '';
  
  try {
    const code = detectedCodes[0];
    console.log('Raw QR code data:', code.rawValue);
    
    if (!code.rawValue || code.rawValue.trim() === '') {
      throw new Error('Pusty kod QR');
    }
    
    const parsedData = JSON.parse(code.rawValue);
    console.log('Parsed QR data:', parsedData);
    
    if (!parsedData.owner_name && !parsedData.pet_name) {
      throw new Error('Brak wymaganych danych w kodzie QR');
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    emit('scanned', parsedData);
    closeModal();
    
  } catch (err: any) {
    console.error('QR processing error:', err);
    scanError.value = `Błąd: ${err.message}`;
    
    setTimeout(() => {
      isValidating.value = false;
      scanError.value = '';
    }, 3000);
  }
};

const onError = (err: any) => {
  console.error('QR Scanner error:', err);
  cameraError.value = `Błąd kamery: ${err.message || 'Nieznany błąd'}`;
  isCameraActive.value = false;
  isLoading.value = false;
};

const onCameraOn = () => {
  console.log('Camera activated successfully');
  isCameraActive.value = true;
  isLoading.value = false;
  cameraError.value = '';
};

const onCameraOff = () => {
  console.log('Camera deactivated');
  isCameraActive.value = false;
};

const switchCamera = () => {
  camera.value = camera.value === 'rear' ? 'front' : 'rear';
  cameraConstraints.value.facingMode = camera.value === 'rear' ? 'environment' : 'user';
  scanError.value = '';
  console.log('Switched camera to:', camera.value);
};

const closeModal = () => {
  console.log('Closing QR scanner');
  isCameraActive.value = false;
  isLoading.value = false;
  isValidating.value = false;
  scanError.value = '';
  cameraError.value = '';
  emit('close');
};

onMounted(() => {
  console.log('QR Scanner mounted, initializing camera...');
  initializeCamera();
});

onUnmounted(() => {
  console.log('QR Scanner unmounted');
  isCameraActive.value = false;
});
</script>