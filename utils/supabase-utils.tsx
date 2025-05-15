// import { toast } from "react-toastify";
import { toast } from 'sonner';
import { supabase } from './supabase-client';
import { userSignal } from '@/store';

export const createUserInSupabase = async ({
  userRole,
  userData,
  tableName,
  tableData,
}: {
  userRole: string;
  userData: {
    email: string;
    password: string;
  };
  tableName: string;
  tableData: Record<string, any>;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        role: userRole,
      },
    },
  });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  if (data.user) {
    const user = data.user;

    const defaultTableData = {
      user_id: user.id,
    };

    const { data: newUser, error: insertError } = await supabase
      .from(tableName)
      .insert({ ...defaultTableData, ...tableData })
      .select('*');

    if (insertError) {
      console.error(insertError);
      toast.error(insertError.message);

      return;
    }

    if (newUser) {
      return newUser[0];
    } else {
      return null;
    }
  }
};
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const getFullImageUrl = (
  bucketName: string,
  assetName: string
): string => {
  if (assetName.startsWith('http')) {
    return assetName;
  }
  const projectId = supabaseUrl.split('.').slice(0, -1).join('.');
  const apiUrl = `${projectId}.co/storage/v1/object/public/${bucketName}/${assetName}`;

  return apiUrl;
};

export const getUser = async () => {
  let { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('error', error);
    return null;
  }
  userSignal.value = data.user;
  return data.user;
};

export const uploadFileAndGetUrl = async (
  bucketName: string,
  fileName: string,
  file: File,
  fileType: 'avatar' | 'logo' | 'product' | 'other'
): Promise<string | null> => {
  const timestamp = Date.now();
  const filePath = `${fileType}-${fileName}-${timestamp}`;

  const { data, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    toast.error(uploadError.message);
    console.error(uploadError);
    return null;
  }
  return data.path;
};
