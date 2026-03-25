import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Document } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('प्रोफाइल सफलतापूर्वक सहेजी गई');
    },
    onError: (error: Error) => {
      toast.error('प्रोफाइल सहेजने में त्रुटि: ' + error.message);
    },
  });
}

// Document Queries
export function useGetMyDocuments() {
  const { actor, isFetching } = useActor();

  return useQuery<Document[]>({
    queryKey: ['myDocuments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      docId,
      fileName,
      fileType,
      uploadDate,
      fileSize,
      blob,
    }: {
      docId: string;
      fileName: string;
      fileType: string;
      uploadDate: bigint;
      fileSize: bigint;
      blob: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadDocument(docId, fileName, fileType, uploadDate, fileSize, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] });
      toast.success('दस्तावेज़ सफलतापूर्वक अपलोड किया गया');
    },
    onError: (error: Error) => {
      toast.error('दस्तावेज़ अपलोड करने में त्रुटि: ' + error.message);
    },
  });
}

export function useDeleteDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (docId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDocument(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] });
      toast.success('दस्तावेज़ सफलतापूर्वक हटाया गया');
    },
    onError: (error: Error) => {
      toast.error('दस्तावेज़ हटाने में त्रुटि: ' + error.message);
    },
  });
}
