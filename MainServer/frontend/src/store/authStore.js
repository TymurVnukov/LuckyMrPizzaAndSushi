import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:22903/api/auth";
export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password) => {
		set({ error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password });
			set({ user: response.data.user, isAuthenticated: true});
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up"});
			throw error;
		}
	},
    verifyEmail: async (code) => {
        set({ error: null })
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true});
            return response.data
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up"});
			throw error;
        }
    },
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null })
		try {
			const response = await axios.get(`${API_URL}/check-auth`)
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isAuthenticated: false, isCheckingAuth: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({ user: response.data.user, isAuthenticated: true, error: null });
		} catch (error) {
			set({ error: error.response.data.message || "Error login up"});
			throw error;
		}
	},
	logout: async () => {
		set({ error: null });
		try {
			const response = await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null });
		} catch (error) {
			set({ error: error.response.data.message || "Error logout up"});
			throw error;
		}
	},
	forgotPassword: async (email) => {
		set({ error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message });
		} catch (error) {
			const errorMessage = error.response?.data?.error || "Error in forgot password";
			set({ error: errorMessage });
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ error: null })
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password })
			set({ message: response.data.message })
		}catch (error) {
			set({ message: error || "Error reset password"});
			throw error;
		}
	}

}))