import { useTranslation } from "react-i18next";
import { Form, Input, type FormInstance } from "antd";
import { createSchemaFieldRule } from "antd-zod";
import { z } from "zod";

import { useAntdForm } from "@/hooks";
import { type HuaweiCloudAccessConfig } from "@/domain/access";

type AccessEditFormHuaweiCloudConfigFieldValues = Partial<HuaweiCloudAccessConfig>;

export type AccessEditFormHuaweiCloudConfigProps = {
  form: FormInstance;
  formName: string;
  disabled?: boolean;
  initialValues?: AccessEditFormHuaweiCloudConfigFieldValues;
  onValuesChange?: (values: AccessEditFormHuaweiCloudConfigFieldValues) => void;
};

const initFormModel = (): AccessEditFormHuaweiCloudConfigFieldValues => {
  return {
    accessKeyId: "",
    secretAccessKey: "",
    region: "cn-north-1",
  };
};

const AccessEditFormHuaweiCloudConfig = ({ form, formName, disabled, initialValues, onValuesChange }: AccessEditFormHuaweiCloudConfigProps) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    accessKeyId: z
      .string()
      .min(1, t("access.form.huaweicloud_access_key_id.placeholder"))
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim(),
    secretAccessKey: z
      .string()
      .min(1, t("access.form.huaweicloud_secret_access_key.placeholder"))
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim(),
    // TODO: 该字段仅用于申请证书，后续迁移到工作流表单中
    region: z
      .string()
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim()
      .nullish(),
  });
  const formRule = createSchemaFieldRule(formSchema);
  const { form: formInst, formProps } = useAntdForm<z.infer<typeof formSchema>>({
    form: form,
    initialValues: initialValues ?? initFormModel(),
  });

  const handleFormChange = (_: unknown, values: z.infer<typeof formSchema>) => {
    onValuesChange?.(values as AccessEditFormHuaweiCloudConfigFieldValues);
  };

  return (
    <Form {...formProps} form={formInst} disabled={disabled} layout="vertical" name={formName} onValuesChange={handleFormChange}>
      <Form.Item
        name="accessKeyId"
        label={t("access.form.huaweicloud_access_key_id.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("access.form.huaweicloud_access_key_id.tooltip") }}></span>}
      >
        <Input autoComplete="new-password" placeholder={t("access.form.huaweicloud_access_key_id.placeholder")} />
      </Form.Item>

      <Form.Item
        name="secretAccessKey"
        label={t("access.form.huaweicloud_secret_access_key.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("access.form.huaweicloud_secret_access_key.tooltip") }}></span>}
      >
        <Input.Password autoComplete="new-password" placeholder={t("access.form.huaweicloud_secret_access_key.placeholder")} />
      </Form.Item>

      <Form.Item
        name="region"
        label={t("access.form.huaweicloud_region.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("access.form.huaweicloud_region.tooltip") }}></span>}
      >
        <Input placeholder={t("access.form.huaweicloud_region.placeholder")} />
      </Form.Item>
    </Form>
  );
};

export default AccessEditFormHuaweiCloudConfig;
