package deployer

import (
	"context"
	"fmt"

	"github.com/usual2970/certimate/internal/domain"
	"github.com/usual2970/certimate/internal/pkg/core/deployer"
	"github.com/usual2970/certimate/internal/pkg/core/logger"
	"github.com/usual2970/certimate/internal/repository"
)

type Deployer interface {
	Deploy(ctx context.Context) error
}

func NewWithDeployNode(node *domain.WorkflowNode, certdata struct {
	Certificate string
	PrivateKey  string
},
) (Deployer, error) {
	if node.Type != domain.WorkflowNodeTypeDeploy {
		return nil, fmt.Errorf("node type is not deploy")
	}

	accessRepo := repository.NewAccessRepository()
	accessId := node.GetConfigString("providerAccessId")
	access, err := accessRepo.GetById(context.Background(), accessId)
	if err != nil {
		return nil, fmt.Errorf("failed to get access #%s record: %w", accessId, err)
	}

	deployProvider := node.GetConfigString("provider")
	deployConfig := node.GetConfigMap("providerConfig")
	deployer, logger, err := createDeployer(domain.DeployProviderType(deployProvider), access.Config, deployConfig)
	if err != nil {
		return nil, err
	}

	return &proxyDeployer{
		logger:            logger,
		deployer:          deployer,
		deployCertificate: certdata.Certificate,
		deployPrivateKey:  certdata.PrivateKey,
	}, nil
}

// TODO: 暂时使用代理模式以兼容之前版本代码，后续重新实现此处逻辑
type proxyDeployer struct {
	logger            logger.Logger
	deployer          deployer.Deployer
	deployCertificate string
	deployPrivateKey  string
}

func (d *proxyDeployer) Deploy(ctx context.Context) error {
	_, err := d.deployer.Deploy(ctx, d.deployCertificate, d.deployPrivateKey)
	return err
}
