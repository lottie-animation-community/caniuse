import Handlebars from 'handlebars';
import { loadTemplate } from './index';
import { Bug, Link, NotesByNum } from '../src/common';
import { PlayerTypes, PlayerTypesKeys } from '../helpers/featuresList';

const featuresIds = {
  NOTES: 'notes',
  RESOURCES: 'resources',
  SUBFEATURES: 'subfeatures',
  KNOWN_ISSUES: 'known_issues',
};

const tabPrefix = 'tab-';
const viewPrefix = 'view-';

const registerNavigation = async (): Promise<void> => {
  const featuresTab = await loadTemplate('features-tab.html') as HandlebarsTemplateDelegate<any>;

  const buildNotesTab = (notes: string, notesByNum: NotesByNum) => {
    const notesToArray = Object.keys(notesByNum).map((key) => ({
      id: key,
      value: notesByNum[key],
    }
    ));
    if (!notes && !notesToArray.length) {
      return null;
    }
    return featuresTab({
      id: `${tabPrefix}${featuresIds.NOTES}`,
      name: 'Notes',
      count: `${notesToArray.length + (notes ? 1 : 0)}`,
    });
  };

  const buildResourcesTab = (spec: string, links: Link[]) => {
    if (!spec && !links.length) {
      return null;
    }
    return featuresTab({
      id: `${tabPrefix}${featuresIds.RESOURCES}`,
      name: 'Resources',
      count: `${links.length + (spec ? 1 : 0)}`,
    });
  };

  const buildSubfeaturesTab = (subFeatures: string[]) => {
    if (!subFeatures.length) {
      return null;
    }
    return featuresTab({
      id: `${tabPrefix}${featuresIds.SUBFEATURES}`,
      name: 'Sub-Features',
      count: `${subFeatures.length}`,
    });
  };

  const buildKnownIssuesTab = (bugs: Bug[]) => {
    if (!bugs.length) {
      return null;
    }
    return featuresTab({
      id: `${tabPrefix}${featuresIds.KNOWN_ISSUES}`,
      name: 'Known Issues',
      count: `${bugs.length}`,
    });
  };

  Handlebars.registerHelper('features-navigation', (
    notes: string,
    notesByNum: NotesByNum,
    spec: string,
    links: Link[],
    subFeatures: string[],
    bugs: Bug[],
  ) => {
    const tabElements = [
      buildNotesTab(notes, notesByNum),
      buildResourcesTab(spec, links),
      buildSubfeaturesTab(subFeatures),
      buildKnownIssuesTab(bugs),
    ];
    return tabElements.filter((tab) => tab).join('');
  });
};

const registerNotes = async (): Promise<void> => {
  const featuresNotes = await loadTemplate('features-notes.html') as HandlebarsTemplateDelegate<any>;
  Handlebars.registerHelper('features-notes', (
    notes: string,
    notesByNum: NotesByNum,
  ) => {
    const elements = [];
    if (notes) {
      elements.push({
        label: '',
        text: notes,
      });
    }
    Object.keys(notesByNum).forEach((noteKey) => {
      elements.push({
        label: noteKey,
        text: notesByNum[noteKey],
      });
    });
    return featuresNotes({
      id: `${viewPrefix}${featuresIds.NOTES}`,
      elements,
    });
  });
};

const registerResources = async (): Promise<void> => {
  const featuresResources = await loadTemplate('features-resources.html') as HandlebarsTemplateDelegate<any>;
  Handlebars.registerHelper('features-resources', (
    spec: string,
    links: Link[],
  ) => {
    const elements = links.map((link) => (
      {
        title: `[${link.title}](${link.url})`,
      }
    ));
    if (spec) {
      elements.push({
        title: `[Spec](${spec})`,
      });
    }
    return featuresResources({
      id: `${viewPrefix}${featuresIds.RESOURCES}`,
      elements,
    });
  });
};

const registerSubfeatures = async (): Promise<void> => {
  const featuresSubfeatures = await loadTemplate('features-subfeatures.html') as HandlebarsTemplateDelegate<any>;
  Handlebars.registerHelper('features-subfeatures', (
    subfeatures: string[],
  ) => featuresSubfeatures({
    id: `${viewPrefix}${featuresIds.SUBFEATURES}`,
    elements: subfeatures.map((subfeature) => ({ text: subfeature })),
  }));
};

const registerKnownIssues = async (): Promise<void> => {
  const featuresKnownIssues = await loadTemplate('features-bugs.html') as HandlebarsTemplateDelegate<any>;
  Handlebars.registerHelper('features-bugs', (
    bugs: Bug[],
  ) => featuresKnownIssues({
    id: `${viewPrefix}${featuresIds.KNOWN_ISSUES}`,
    elements: bugs.map((bug) => ({ text: bug.description })),
  }));
};

const registerFeatureIcon = async (): Promise<void> => {
  Handlebars.registerHelper('feature-icon', (players: PlayerTypes, playerType: PlayerTypesKeys) => {
    switch (players[playerType]) {
      case 'y':
        return '<span class="icon icon__check" alt="Supported"></span>';
      case 'n':
        return '<span class="icon icon__block" alt="Not supported"></span>';
      default:
        return '<span class="icon icon__bug" alt="Bug"></span>';
    }
  });
};

const registerFeaturesHelper = async (): Promise<void> => {
  await registerNavigation();
  await registerNotes();
  await registerResources();
  await registerSubfeatures();
  await registerKnownIssues();
  await registerFeatureIcon();
};

export default registerFeaturesHelper;
