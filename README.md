Interfejs użytkownika dla aplikacji do zarządzania kartami, stworzony w Vue.js 3 (Composition API) z użyciem Pinia i Tailwind CSS.

**Link do repozytorium API:** [cards-api](https://github.com/tomk2201/cards-api)

---

## Uruchomienie

**Wymagania:** Upewnij się, że backend (API) jest uruchomiony i działa.

1.  **Sklonuj repozytorium**
    ```bash
    git clone https://github.com/tomk2201/cards-frontend.git
    cd cards-frontend
    ```

2.  **Zainstaluj zależności NPM**
    ```bash
    npm install
    ```

3.  **Skonfiguruj plik środowiskowy `.env`**
    *   Stwórz plik `.env` w głównym folderze projektu.
    *   Dodaj do niego następującą zmienną, wskazującą na adres działającego API:
    ```
    VITE_API_BASE_URL=http://127.0.0.1:8000
    ```

4.  **Uruchom serwer deweloperski Vite**
    ```bash
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem wskazanym w terminalu
