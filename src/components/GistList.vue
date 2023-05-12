<template>
    <div class="max-w-screen-lg mx-auto">
        <div class="p-4 bg-white">
            <div class="rounded-lg bg-white p-10 shadow-lg">
                <div class="mb-4 flex items-center">
                    <input v-model="localUsername" type="text" class="w-full rounded-lg border border-gray-400 p-2 focus:outline-none focus:ring-1 focus:ring-gray-500" placeholder="Enter a GitHub username" @keyup.enter="get"/>
                    <button class="ml-2 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600" @click="get">Search</button>
                </div>
            </div>
        </div>
        <div class="p-4 bg-white">
            <div v-if="loading" class="border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-4 h-8 w-8 m-auto"></div>

            <div v-else-if="error" class="font-bold text-red-500">{{ error }}</div>

            <div v-else class="flex flex-col md:flex-row gap-4">
                <div v-if="userInfo.id" class="flex flex-col items-center md:w-1/4">
                    <img class="md:w-4/6 w-1/2 mb-6 rounded-full" :src="userInfo.avatar_url"/>
                    <div class="text-left">
                        <div class="text-md font-bold">{{ userInfo.name }}</div>
                        <div class="text-md text-gray-500 mb-2">{{ userInfo.location }}</div>
                        <div class="text-md">{{ userInfo.bio }}</div>
                    </div>
                </div>
                <div v-if="gists.length" class="flex-grow">
                    <div class="divide-y divide-slate-200">
                        <div v-for="gist in gists" :key="gist.id" class="divide-y divide-slate-200">
                            <div v-for="(file, index) in gist.files" :key="index" class="flex items-center justify-between py-4">
                                <div class="flex items-center">
                                    <img class="w-8 h-8 rounded-full mr-4" :src="userInfo.avatar_url" :alt="userInfo.name">
                                    <div class="text-left">
                                        <a  @click="openPanel(userInfo, file)" class="text-md text-blue-600 cursor-pointer">{{ userInfo.login }} / <span class="font-bold">{{ file.filename }}</span></a>
                                        <div class="text-gray-500 text-sm">Created {{ timeAgo(gist.created_at) }}</div>
                                    </div>
                                </div>
                                <div v-if="file.language" :class="file.color" class="rounded-full px-2 py-1 text-sm">{{ file.language || '' }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <GistSlidePanel :opened="clickedNum" :url="gistUrl"/>
    
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive, nextTick, toRefs, inject, ref } from 'vue';
  import axios, { AxiosError, AxiosResponse } from 'axios';
  import GistSlidePanel from './GistSlidePanel.vue';

  interface Gist {
    id: string
    description: string | null
    html_url: string
    created_at: string
    files: GistFile[]
  }

  interface GistFile {
    filename: string
    language: string
    raw_url: string
    type: string
    size: number
    color: string
  }
  
  interface UserInfo {
    id: string
    name: string
    login: string
    bio: string | null
    location: string
    avatar_url: string | ''
  }
  
  export default defineComponent({
    name: 'GistList',
    components: {
        GistSlidePanel
    },
    props: {
      username: {
        type: String,
        required: false,
      },
      token: {
        type: String,
        required: true,
      },
    },
    data() {
        return {
            localUsername: this.username,
            userInfo: {} as UserInfo,
            gists: [] as Gist[],
            loading: false,
            error: null as string | null,
            clickedNum: 0,
            gistUrl: null as string | null,
        };
    },
    methods: {
        get() {
            this.getGists();
            this.getUserInfo();
        },
        async getGists(): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(`https://api.github.com/users/${this.localUsername}/gists`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });
                const gists: Gist[] = response.data.map((gistData: any) => {
                    const files: GistFile[] = Object.keys(gistData.files).map((filename: string) => {
                        const fileData = gistData.files[filename];
                        const file: GistFile = {
                            filename: fileData.filename,
                            type: fileData.type,
                            raw_url: fileData.raw_url,
                            language: fileData.language,
                            size: fileData.size,
                            color: this.getBadgeColor(fileData.language)
                        };
                        return file;
                    });
                    const gist: Gist = {
                        id: gistData.id,
                        html_url: gistData.html_url,
                        description: gistData.description,
                        files,
                        created_at: gistData.created_at
                    };
                    return gist;
                });
                this.gists = gists;
                this.loading = false;
            }
            catch (error: any) {
                this.loading = false;
                this.error = error;
            }
        },
        async getUserInfo(): Promise<void> {
            this.loading = true;
            this.error = null;
            axios.get(`https://api.github.com/users/${this.localUsername}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })
            .then((response: AxiosResponse<UserInfo>) => {
                this.userInfo = response.data;
                this.loading = false;
            })
            .catch(error => {
                this.loading = false
                this.error = error.response.data.message
            });
        },
        timeAgo(dateTime: string):string {
            const date = new Date(dateTime);
            const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
            let interval = Math.floor(seconds / 31536000);

            if (interval >= 1) {
                return `${interval} year${interval === 1 ? '' : 's'} ago`;
            }

            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                return `${interval} month${interval === 1 ? '' : 's'} ago`;
            }

            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                return `${interval} day${interval === 1 ? '' : 's'} ago`;
            }

            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return `${interval} hour${interval === 1 ? '' : 's'} ago`;
            }

            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return `${interval} minute${interval === 1 ? '' : 's'} ago`;
            }

            return 'a few seconds ago';
        },
        getBadgeColor(language?: string):string {
            let color = '';
            switch (language?.toLowerCase()) {
                case 'html':
                    color = 'bg-blue-100 text-blue-800';
                    break;
                case 'css':
                    color = 'bg-green-100 text-green-800';
                    break;
                case 'python':
                    color = 'bg-red-100 text-red-800';
                    break;
                case 'objective-c':
                    color = 'bg-orange-100 text-orange-800';
                    break;
                default:
                    color = 'bg-gray-100 text-gray-800';
                    break;
            }
            return color;
        },
        openPanel(userInfo: UserInfo, file: GistFile) {
            this.gistUrl = file.raw_url
            this.clickedNum++
        }
    },
    
  })
  </script>
  