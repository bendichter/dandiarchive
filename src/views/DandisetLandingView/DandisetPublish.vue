<template>
  <v-card
    outlined
    class="mt-4 pa-3"
  >
    <v-row
      v-if="!publishButtonHidden"
      class="mb-4"
      no-gutters
    >
      <v-tooltip
        :disabled="!publishDisabledMessage"
        left
      >
        <template #activator="{ on }">
          <div
            style="width: 100%"
            v-on="on"
          >
            <v-btn
              block
              color="success"
              :disabled="publishButtonDisabled"
              @click="publish"
            >
              Publish
              <v-spacer />
              <v-icon>mdi-upload</v-icon>
            </v-btn>
          </div>
        </template>
        <span>{{ publishDisabledMessage }}</span>
      </v-tooltip>
    </v-row>

    <v-row
      v-if="currentDandiset.version_validation_errors.length "
      class="mb-4"
      no-gutters
    >
      <v-menu
        :nudge-width="200"
        offset-y
        open-on-hover
      >
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-card
                class="amber lighten-5 no-text-transform"
                outlined
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                <v-row class="align-center px-4">
                  <v-col
                    cols="1"
                    class="justify-center py-0"
                  >
                    <v-icon
                      color="warning"
                      class="mr-1"
                    >
                      mdi-playlist-remove
                    </v-icon>
                  </v-col>
                  <v-spacer />
                  <v-col
                    cols="9"
                    class="py-0"
                  >
                    <div class="text-caption">
                      This Dandiset has {{ currentDandiset.version_validation_errors.length }}
                      metadata validation error(s).
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <span>Fix issues with metadata</span>
          </v-tooltip>
        </template>
        <v-card class="pa-1">
          <v-list
            style="max-height: 200px"
            class="overflow-y-auto"
          >
            <div
              v-for="(error, index) in currentDandiset.version_validation_errors"
              :key="index"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    {{ getValidationErrorIcon(error.field) }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  {{ error.field }}: {{ error.message }}
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </div>
          </v-list>
          <v-btn
            color="primary"
            @click="$emit('edit')"
          >
            Fix issues
          </v-btn>
        </v-card>
      </v-menu>
    </v-row>

    <v-row
      v-if="currentDandiset.asset_validation_errors.length"
      class="mb-4"
      no-gutters
    >
      <v-menu

        :nudge-width="200"
        offset-y
        open-on-hover
      >
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-card
                class="amber lighten-5 no-text-transform"
                outlined
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                <v-row class="align-center px-4">
                  <v-col
                    cols="1"
                    class="justify-center py-0"
                  >
                    <v-icon
                      color="warning"
                      class="mr-1"
                    >
                      mdi-database-remove
                    </v-icon>
                  </v-col>
                  <v-spacer />
                  <v-col
                    cols="9"
                    class="py-0"
                  >
                    <div class="text-caption">
                      This Dandiset has {{ currentDandiset.asset_validation_errors.length }}
                      asset validation error(s).
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <span>Fix issues with assets</span>
          </v-tooltip>
        </template>
        <v-card class="pa-1">
          <v-list
            style="max-height: 200px"
            class="overflow-y-auto"
          >
            <div
              v-for="(error, index) in currentDandiset.asset_validation_errors"
              :key="index"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    {{ getValidationErrorIcon(error.field) }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  {{ error.field }}: {{ error.message }}
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </div>
          </v-list>
        </v-card>
      </v-menu>
    </v-row>
    <v-row>
      <v-subheader class="mb-2 black--text text-h5">
        This Version
      </v-subheader>
    </v-row>
    <v-row
      class="pa-2 mb-5 text-body-2 align-center"
      style="border-top: thin solid rgba(0, 0, 0, 0.12);
             border-bottom: thin solid rgba(0, 0, 0, 0.12);
             text-align: center;"
    >
      <v-col
        :cols="$vuetify.breakpoint.md ? 12 : 4"
        style=""
      >
        {{ formatDate(currentDandiset.modified) }}
      </v-col>
      <v-col>
        <h3>{{ currentVersion.toUpperCase() }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-subheader class="mb-2 black--text text-h5">
        Other Versions
      </v-subheader>
    </v-row>
    <v-row
      v-for="(version, i) in otherVersions"
      :key="i"
      class="pa-2 text-body-2 align-center justify-center"
      style="border-top: thin solid rgba(0, 0, 0, 0.12);
             border-bottom: thin solid rgba(0, 0, 0, 0.12);
             text-align: center;"
    >
      <v-col
        :cols="$vuetify.breakpoint.md ? 12 : 4"
      >
        {{ formatDate(version.modified) }}
      </v-col>
      <v-col>
        <v-btn
          outlined
          @click="setVersion(version)"
        >
          {{ version.version.toUpperCase() }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent, computed, ComputedRef,
} from '@vue/composition-api';

import moment from 'moment';

import { publishRest, loggedIn as loggedInFunc, user as userFunc } from '@/rest';
import store from '@/store';
import { User, Version } from '@/types';

import { draftVersion, VALIDATION_ICONS } from '@/utils/constants';
import { RawLocation } from 'vue-router';

function getValidationErrorIcon(errorField: string): string {
  const icons = Object.keys(VALIDATION_ICONS).filter((field) => errorField.includes(field));
  if (icons.length > 0) {
    return (VALIDATION_ICONS as any)[icons[0]];
  }
  return VALIDATION_ICONS.DEFAULT;
}

// Sort versions from most recently modified to least recently modified.
// The DRAFT version is always the first element when present.
function sortVersions(v1: Version, v2: Version): number {
  // Always put draft first
  if (v1.version === draftVersion || v1.modified > v2.modified) {
    return -1;
  }
  if (v1.modified < v2.modified) {
    return 1;
  }
  return 0;
}

export default defineComponent({
  name: 'DandisetPublish',
  props: {
    userCanModifyDandiset: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    const currentDandiset = computed(() => store.state.dandiset.publishDandiset);
    const currentVersion = computed(() => store.getters.dandiset.version);

    const otherVersions: ComputedRef<Version[]|undefined> = computed(
      () => store.state.dandiset.versions?.filter(
        (version: Version) => version.version !== currentVersion.value,
      ).sort(sortVersions),
    );

    const user: ComputedRef<User|null> = computed(userFunc);
    const loggedIn: ComputedRef<boolean> = computed(loggedInFunc);

    const isOwner: ComputedRef<boolean> = computed(
      () => !!(store.state.dandiset.owners?.find(
        (owner: User) => owner.username === user.value?.username,
      )),
    );

    const publishDisabledMessage: ComputedRef<string> = computed(() => {
      if (!loggedIn.value) {
        return 'You must be logged in to edit.';
      }
      if (isOwner.value && currentVersion.value !== draftVersion) {
        return 'Only draft versions can be published.';
      }
      // NOTE: must access the prop directly instead of destructuring to preserve reactivity
      // i.e. `const { userCanModifyDandiset } = props;` won't be reactive
      // See https://github.com/vuejs/composition-api/issues/156
      if (!props.userCanModifyDandiset) {
        return 'You do not have permission to edit this dandiset.';
      }
      if (currentDandiset.value?.status === 'Pending') {
        return 'This dandiset has not yet been validated.';
      }
      if (currentDandiset.value?.status === 'Validating') {
        return 'Currently validating this dandiset.';
      }
      if (currentDandiset.value?.status === 'Published') {
        return 'No changes since last publish.';
      }
      return '';
    });

    const publishButtonDisabled: ComputedRef<boolean> = computed(
      () => !!(currentDandiset.value?.version_validation_errors.length
        || currentDandiset.value?.asset_validation_errors.length
        || publishDisabledMessage.value),
    );

    const publishButtonHidden: ComputedRef<boolean> = computed(() => {
      const { owners } = store.state.dandiset;
      // Hide the publish button if the user is not an owner of the dandiset
      return !(loggedIn.value && !!(owners?.find(
        (owner: User) => owner.username === user.value?.username,
      )));
    });

    function formatDate(date: string): string {
      return moment(date).format('ll');
    }

    function setVersion({ version: newVersion }: any) {
      const version = newVersion || draftVersion;

      if (ctx.root.$route.params.version !== version) {
        ctx.root.$router.replace({
          ...ctx.root.$route,
          params: {
            ...ctx.root.$route.params,
            version,
          },
        } as RawLocation);

        store.dispatch.dandiset.fetchPublishDandiset({
          identifier: currentDandiset.value?.dandiset.identifier,
          version: newVersion,
        });
      }
    }

    async function publish() {
      if (currentDandiset.value) {
        const version = await publishRest.publish(currentDandiset.value.dandiset.identifier);
        // re-initialize the dataset to load the newly published version
        await store.dispatch.dandiset.initializeDandisets({
          identifier: currentDandiset.value?.dandiset.identifier,
          version: version.version,
        });
      }
    }

    return {
      currentDandiset,
      currentVersion,
      otherVersions,
      setVersion,
      formatDate,
      sortVersions,
      user,
      publishDisabledMessage,
      publishButtonDisabled,
      publishButtonHidden,
      getValidationErrorIcon,
      publish,
      draftVersion,
    };
  },
});
</script>
