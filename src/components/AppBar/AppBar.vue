<template>
  <v-app-bar app>
    <v-menu
      open-on-hover
      offset-y
    >
      <template #activator="{on}">
        <v-icon
          class="d-md-none mr-4"
          v-on="on"
        >
          mdi-menu
        </v-icon>
      </template>
      <v-list>
        <template v-for="navItem in navItems">
          <v-list-item
            v-if="!navItem.if || navItem.if()"
            :key="navItem.text"
          >
            <v-btn
              v-if="!navItem.external"
              :to="{name: navItem.to}"
              exact
              text
            >
              {{ navItem.text }}
            </v-btn>
            <v-btn
              v-if="navItem.external"
              :href="navItem.to"
              target="_blank"
              rel="noopener"
              text
            >
              {{ navItem.text }}
              <v-icon class="ml-1">
                mdi-open-in-new
              </v-icon>
            </v-btn>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
    <v-toolbar-title>
      <v-img
        alt="DANDI logo"
        contain
        max-height="48px"
        max-width="120px"
        src="@/assets/logo.svg"
        class="mr-2"
      />
    </v-toolbar-title>
    <span class="d-none d-md-flex">
      <template v-for="navItem in navItems">
        <v-btn
          v-if="!navItem.external && (!navItem.if || navItem.if())"
          :key="navItem.text"
          :to="{name: navItem.to}"
          exact
          text
        >
          {{ navItem.text }}
        </v-btn>
        <v-btn
          v-if="navItem.external && (!navItem.if || navItem.if())"
          :key="navItem.text"
          :href="navItem.to"
          target="_blank"
          rel="noopener"
          text
        >
          {{ navItem.text }}
          <v-icon class="ml-1">
            mdi-open-in-new
          </v-icon>
        </v-btn>
      </template>
    </span>

    <v-spacer />

    <div v-if="!insideIFrame">
      <template v-if="loggedIn">
        <v-btn
          :to="{ name: 'createDandiset' }"
          exact
          class="mx-3"
          color="primary"
          rounded
        >
          New Dandiset
        </v-btn>
        <UserMenu />
      </template>
      <template v-else>
        <v-tooltip
          bottom
          :disabled="cookiesEnabled"
        >
          <template #activator="{ on }">
            <div v-on="on">
              <v-btn
                id="login"
                class="mx-1"
                color="primary"
                rounded
                :disabled="!cookiesEnabled"
                @click="login"
              >
                Log In with GitHub
              </v-btn>
            </div>
          </template>
          <span>Enable cookies to log in.</span>
        </v-tooltip>
      </template>
    </div>
  </v-app-bar>
</template>

<script>
import {
  cookiesEnabled, loggedIn, insideIFrame, publishRest,
} from '@/rest';
import { dandiAboutUrl, dandiDocumentationUrl, dandiHelpUrl } from '@/utils/constants';
import UserMenu from '@/components/AppBar/UserMenu.vue';

export default {
  name: 'AppBar',
  components: {
    UserMenu,
  },
  data() {
    return {
      dandiAboutUrl,
      dandiDocumentationUrl,
      navItems: [
        {
          text: 'Welcome',
          to: 'home',
        },
        {
          text: 'Public Dandisets',
          to: 'publicDandisets',
        },
        {
          text: 'My Dandisets',
          to: 'myDandisets',
          if: loggedIn,
        },
        {
          text: 'About',
          to: dandiAboutUrl,
          external: true,
        },
        {
          text: 'Documentation',
          to: dandiDocumentationUrl,
          external: true,
        },
        {
          text: 'Help',
          to: dandiHelpUrl,
          external: true,
        },
      ],
    };
  },
  computed: {
    loggedIn,
    insideIFrame,
    cookiesEnabled,
    returnObject() {
      const { name, query, params } = this.$route;
      return JSON.stringify({ name, query, params });
    },
  },
  methods: {
    login() {
      publishRest.login();
    },
  },
};
</script>
