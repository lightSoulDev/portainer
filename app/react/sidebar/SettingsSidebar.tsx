import {
  Users,
  Award,
  Settings,
  HardDrive,
  Radio,
  FileText,
  Bell,
} from 'lucide-react';

import { usePublicSettings } from '@/react/portainer/settings/queries';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';
import { SidebarParent } from './SidebarItem/SidebarParent';

interface Props {
  isAdmin: boolean;
  isTeamLeader?: boolean;
}

export function SettingsSidebar({ isAdmin, isTeamLeader }: Props) {
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  const showUsersSection =
    !window.ddExtension && (isAdmin || (isTeamLeader && !teamSyncQuery.data));

  return (
    <SidebarSection title="Administration">
      {showUsersSection && (
        <SidebarParent
          label="User-related"
          icon={Users}
          to="portainer.users"
          pathOptions={{ includePaths: ['portainer.teams', 'portainer.roles'] }}
          data-cy="portainerSidebar-userRelated"
        >
          <SidebarItem
            to="portainer.users"
            label="Users"
            isSubMenu
            data-cy="portainerSidebar-users"
          />
          <SidebarItem
            to="portainer.teams"
            label="Teams"
            isSubMenu
            data-cy="portainerSidebar-teams"
          />

          {isAdmin && (
            <SidebarItem
              to="portainer.roles"
              label="Roles"
              isSubMenu
              data-cy="portainerSidebar-roles"
            />
          )}
        </SidebarParent>
      )}
      {isAdmin && (
        <>
          <SidebarParent
            label="Environment-related"
            icon={HardDrive}
            to="portainer.endpoints"
            pathOptions={{
              includePaths: [
                'portainer.wizard.endpoints',
                'portainer.groups',
                'portainer.tags',
              ],
            }}
            data-cy="k8sSidebar-networking"
          >
            <SidebarItem
              label="Environments"
              to="portainer.endpoints"
              ignorePaths={['portainer.endpoints.updateSchedules']}
              includePaths={['portainer.wizard.endpoints']}
              isSubMenu
              data-cy="portainerSidebar-environments"
            />
            <SidebarItem
              to="portainer.groups"
              label="Groups"
              isSubMenu
              data-cy="portainerSidebar-environmentGroups"
            />
            <SidebarItem
              to="portainer.tags"
              label="Tags"
              isSubMenu
              data-cy="portainerSidebar-environmentTags"
            />
            {isBE && (
              <SidebarItem
                to="portainer.endpoints.updateSchedules"
                label="Update & Rollback"
                isSubMenu
                data-cy="portainerSidebar-updateSchedules"
              />
            )}
          </SidebarParent>

          <SidebarItem
            label="Registries"
            to="portainer.registries"
            icon={Radio}
            data-cy="portainerSidebar-registries"
          />

          {isBE && (
            <SidebarItem
              to="portainer.licenses"
              label="Licenses"
              icon={Award}
              data-cy="portainerSidebar-licenses"
            />
          )}

          <SidebarParent
            label="Logs"
            to="portainer.authLogs"
            icon={FileText}
            pathOptions={{
              includePaths: ['portainer.activityLogs'],
            }}
            data-cy="k8sSidebar-logs"
          >
            <SidebarItem
              label="Authentication"
              to="portainer.authLogs"
              isSubMenu
              data-cy="portainerSidebar-authLogs"
            />
            <SidebarItem
              to="portainer.activityLogs"
              label="Activity"
              isSubMenu
              data-cy="portainerSidebar-activityLogs"
            />
          </SidebarParent>
        </>
      )}
      <SidebarItem
        to="portainer.notifications"
        icon={Bell}
        label="Notifications"
        data-cy="portainerSidebar-notifications"
      />
      {isAdmin && (
        <SidebarParent
          to="portainer.settings"
          label="Settings"
          icon={Settings}
          data-cy="portainerSidebar-settings"
        >
          <SidebarItem
            to="portainer.settings"
            label="General"
            isSubMenu
            ignorePaths={[
              'portainer.settings.authentication',
              'portainer.settings.edgeCompute',
            ]}
            data-cy="portainerSidebar-generalSettings"
          />
          {!window.ddExtension && (
            <SidebarItem
              to="portainer.settings.authentication"
              label="Authentication"
              isSubMenu
              data-cy="portainerSidebar-authentication"
            />
          )}
          {isBE && (
            <SidebarItem
              to="portainer.settings.sharedcredentials"
              label="Shared Credentials"
              isSubMenu
              data-cy="portainerSidebar-cloud"
            />
          )}
          <SidebarItem
            to="portainer.settings.edgeCompute"
            label="Edge Compute"
            isSubMenu
            data-cy="portainerSidebar-edgeCompute"
          />

          <SidebarItem.Wrapper label="Help / About">
            <a
              href={
                process.env.PORTAINER_EDITION === 'CE'
                  ? 'https://www.portainer.io/community_help'
                  : 'https://documentation.portainer.io/r/business-support'
              }
              target="_blank"
              rel="noreferrer"
              className="hover:!underline focus:no-underline text-sm flex h-8 w-full items-center rounded px-3 transition-colors duration-200 hover:bg-blue-5/20 be:hover:bg-gray-5/20 th-dark:hover:bg-gray-true-5/20"
            >
              Help / About
            </a>
          </SidebarItem.Wrapper>
        </SidebarParent>
      )}
    </SidebarSection>
  );
}
