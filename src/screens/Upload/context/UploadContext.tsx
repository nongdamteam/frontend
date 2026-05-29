import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  PendingTag,
  SelectedMedia,
  TagPosition,
  UploadDraft,
  UploadPrivacy,
  UploadStep,
} from '@/@types/upload';

const INITIAL_PRIVACY: UploadPrivacy = {
  isPublic: true,
  allowComments: true,
  hideLikes: false,
};

const INITIAL_DRAFT: UploadDraft = {
  media: null,
  caption: '',
  tags: [],
  privacy: INITIAL_PRIVACY,
};

interface UploadState {
  step: UploadStep;
  draft: UploadDraft;
}

const INITIAL_STATE: UploadState = {
  step: 'media',
  draft: INITIAL_DRAFT,
};

type Action =
  | { type: 'GO_TO'; step: UploadStep }
  | { type: 'SET_MEDIA'; media: SelectedMedia }
  | { type: 'SET_CAPTION'; caption: string }
  | { type: 'ADD_TAG'; tag: PendingTag }
  | { type: 'REMOVE_TAG'; id: string }
  | { type: 'UPDATE_TAG_POSITION'; id: string; position: TagPosition }
  | { type: 'SET_PRIVACY'; privacy: Partial<UploadPrivacy> }
  | { type: 'RESET' };

function reducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case 'GO_TO':
      return { ...state, step: action.step };
    case 'SET_MEDIA':
      return { ...state, draft: { ...state.draft, media: action.media } };
    case 'SET_CAPTION':
      return { ...state, draft: { ...state.draft, caption: action.caption } };
    case 'ADD_TAG':
      // 중복 키워드는 무시
      if (state.draft.tags.some(t => t.keyword === action.tag.keyword)) {
        return state;
      }
      return {
        ...state,
        draft: { ...state.draft, tags: [...state.draft.tags, action.tag] },
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        draft: {
          ...state.draft,
          tags: state.draft.tags.filter(t => t.id !== action.id),
        },
      };
    case 'UPDATE_TAG_POSITION':
      return {
        ...state,
        draft: {
          ...state.draft,
          tags: state.draft.tags.map(t =>
            t.id === action.id ? { ...t, position: action.position } : t,
          ),
        },
      };
    case 'SET_PRIVACY':
      return {
        ...state,
        draft: {
          ...state.draft,
          privacy: { ...state.draft.privacy, ...action.privacy },
        },
      };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

interface UploadContextValue {
  step: UploadStep;
  draft: UploadDraft;
  goTo: (step: UploadStep) => void;
  setMedia: (media: SelectedMedia) => void;
  setCaption: (caption: string) => void;
  addTag: (tag: PendingTag) => void;
  removeTag: (id: string) => void;
  updateTagPosition: (id: string, position: TagPosition) => void;
  setPrivacy: (privacy: Partial<UploadPrivacy>) => void;
  reset: () => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function UploadProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const goTo = useCallback(
    (step: UploadStep) => dispatch({ type: 'GO_TO', step }),
    [],
  );
  const setMedia = useCallback(
    (media: SelectedMedia) => dispatch({ type: 'SET_MEDIA', media }),
    [],
  );
  const setCaption = useCallback(
    (caption: string) => dispatch({ type: 'SET_CAPTION', caption }),
    [],
  );
  const addTag = useCallback(
    (tag: PendingTag) => dispatch({ type: 'ADD_TAG', tag }),
    [],
  );
  const removeTag = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_TAG', id }),
    [],
  );
  const updateTagPosition = useCallback(
    (id: string, position: TagPosition) =>
      dispatch({ type: 'UPDATE_TAG_POSITION', id, position }),
    [],
  );
  const setPrivacy = useCallback(
    (privacy: Partial<UploadPrivacy>) =>
      dispatch({ type: 'SET_PRIVACY', privacy }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value = useMemo(
    () => ({
      step: state.step,
      draft: state.draft,
      goTo,
      setMedia,
      setCaption,
      addTag,
      removeTag,
      updateTagPosition,
      setPrivacy,
      reset,
    }),
    [
      state.step,
      state.draft,
      goTo,
      setMedia,
      setCaption,
      addTag,
      removeTag,
      updateTagPosition,
      setPrivacy,
      reset,
    ],
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUploadContext() {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error('useUploadContext must be used within UploadProvider');
  }
  return ctx;
}
